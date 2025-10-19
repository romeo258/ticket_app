import { patchState, signalStore, watchState, withComputed, withHooks, withMethods, withState } from '@ngrx/signals'
import { initialState, IState } from '../interface/state';
import { computed, inject } from '@angular/core';
import { getMessageCount, updateComments } from '../utils/fileutils';
import { HotToastService } from '@ngxpert/hot-toast';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from "@ngrx/operators";
import { pipe, tap, switchMap } from 'rxjs';
import { IResponse } from '../interface/response';
import { UserService } from '../service/user.service';
import { NotificationService } from '../service/notification.service';
import { TicketService } from '../service/ticket.service';
import { IQuery } from '../interface/query';
import { ITicket } from '../interface/ticket';
import { saveAs } from 'file-saver';
import { IUser } from '../interface/user';
import { UpdatePassword } from '../interface/credential';


export const AppStore = signalStore(
    { providedIn: 'root' },
    withState<IState>(initialState),
    withComputed((store) => ({
        unreadMessageCount: computed(() => (getMessageCount(store.messages())))
    })),
    withMethods((store, userService = inject(UserService), ticketService = inject(TicketService), notificationService = inject(NotificationService), toastService = inject(HotToastService)) => ({
        getProfile: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap(() => userService.profile$().pipe(
                tapResponse({
                    next: (response: IResponse) => {
                        patchState(store, (state) => ({ profile: response.data.user, devices: response.data.devices, loading: false, error: null }));
                    },
                    error: (error: string) => {
                        toastService.error(error ? error : 'An error occured');
                        patchState(store, { loading: false, error });
                    }
                })
            )))),
        getMessages: rxMethod<void>(pipe(
            tap(() => patchState(store, { error: null })),
            switchMap(() => notificationService.messages$().pipe(
                tapResponse({
                    next: (response: IResponse) => {
                        patchState(store, (state) => ({ messages: response.data.messages, loading: false, error: null }));
                    },
                    error: (error: string) => {
                        toastService.error(error ? error : 'An error occured');
                        patchState(store, { loading: false, error });
                    }
                })
            )))),
        getTickets: rxMethod<IQuery>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((query) => ticketService.tickets$(query).pipe(
                tapResponse({
                    next: (response: IResponse) => {
                        patchState(store, (state) => ({ tickets: response.data.tickets, pages: response.data.pages, loading: false, error: null, query }));
                        //toastService.success(response.message);
                    },
                    error: (error: string) => {
                        patchState(store, { loading: false, error });
                        toastService.error(error ? error : 'An error occured');
                    }
                })
            )))),
        getAllTickets: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap(() => ticketService.allTickets$().pipe(
                tapResponse({
                    next: (response: IResponse) => {
                        patchState(store, (state) => ({ allTickets: response.data.tickets, loading: false, error: null }));
                        // toastService.success(response.message);
                    },
                    error: (error: string) => {
                        patchState(store, { loading: false, error });
                        toastService.error(error ? error : 'An error occured');
                    }
                })
            )))),
        getTicket: rxMethod<string>(pipe(
                tap(() => patchState(store, { loading: true, error: null, ticketDetail: null })),
                switchMap((ticketUuid) => ticketService.ticket$(ticketUuid).pipe(
                    tapResponse({
                    next: (response: IResponse) => {
                        patchState(store, (state) => ({ ticketDetail: { ticket: response.data.ticket, comments: response.data.comments, files: response.data.files, tasks: response.data.tasks, assignee: response.data.assignee, techSupports: response.data.techSupports, user: response.data.user }, loading: false, error: null }));
                        //toastService.success(response.message);
                    },
                    error: (error: string) => {
                        patchState(store, { loading: false, error });
                        toastService.error(error ? error : 'An error occured.');
                    }
                    })
            )))),
        saveTicket: rxMethod<FormData>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((form) => ticketService.creatTicket$(form).pipe(
                tapResponse({
                    next: (response: IResponse) => {
                        patchState(store, (state) => {
                            let tickets: ITicket[] = null; 
                            let allTickets: ITicket[] = null;
                            if (state.tickets?.length > 0) {
                                tickets = [response.data.ticket, ...state.tickets];
                            }
                            if (state.allTickets?.length > 0) {
                                allTickets = [response.data.ticket, ...state.allTickets];
                            }
                            return ({ tickets, allTickets, loading: false, error: null });
                        });
                        toastService.success(response.message);
                    },
                    error: (error: string) => {
                        patchState(store, (state) => ({ loading: false, error }));
                        toastService.error(error ? error : 'An error occured.');
                    }
                })
            )))),
        updateTicket: rxMethod<ITicket>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((ticket) => ticketService.updateTicket$(ticket).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ ticketDetail: { ...state.ticketDetail, ticket: response.data.ticket }, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured.');
                }
                })
            )))),
        addComment: rxMethod<FormData>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((commentForm) => ticketService.addComment$(commentForm).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ ticketDetail: { ...state.ticketDetail, comments: [response.data.comment, ...store.ticketDetail().comments] }, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured.');
                }
                })
            )))),
        updateComment: rxMethod<FormData>(pipe(
            tap(() => patchState(store, (state) => ({ loading: true, error: null }))),
            switchMap((form) => ticketService.updateComment$(form).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ ticketDetail: { ...state.ticketDetail, comments: updateComments(response.data.comment, state.ticketDetail.comments) }, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured.');
                }
                })
            )))),
        uploadFiles: rxMethod<FormData>(pipe(
            tap(() => patchState(store, (state) => ({ loading: true, error: null }))),
            switchMap((form) => ticketService.uploadFiles$(form).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ ticketDetail: { ...state.ticketDetail, files: [...response.data.files, ...store.ticketDetail().files] }, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured.');
                }
                })
            )))),
        downloadFile: rxMethod<string>(pipe(
            tap(() => patchState(store, (state) => ({ loading: true, error: null }))),
            switchMap((fileUuid) => ticketService.downloadFile$(fileUuid).pipe(
                tapResponse({
                next: (response) => {
                    saveAs(new File([response.body], response.headers.get('File-Name'), { type: `${response.headers.get('Content-Type')};charset=utf-8` }));
                    patchState(store, (state) => ({ loading: false, error: null }));
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured.');
                }
                })
            )))),
        createTask: rxMethod<FormData>(pipe(
            tap(() => patchState(store, (state) => ({ loading: true, error: null }))),
            switchMap((form) => ticketService.createTask$(form).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ ticketDetail: { ...state.ticketDetail, tasks: [response.data.task, ...state.ticketDetail.tasks] }, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured.');
                }
                })
            )))),
        deleteComment: rxMethod<FormData>(pipe(
            tap(() => patchState(store, (state) => ({ loading: true, error: null }))),
            switchMap((form) => ticketService.deleteComment$(form).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ ticketDetail: { ...state.ticketDetail, comments: [...state.ticketDetail.comments.filter(comment => comment.commentUuid != form.get('commentUuid'))] }, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured.');
                }
                })
            )))),
        deleteFile: rxMethod<FormData>(pipe(
            tap(() => patchState(store, (state) => ({ loading: true, error: null }))),
            switchMap((form) => ticketService.deleteFile$(form).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ ticketDetail: { ...state.ticketDetail, files: [...state.ticketDetail.files.filter(file => file.fileUuid != form.get('fileUuid'))] }, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {

                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured.');
                }
                })
            )))),
        updateAssignee: rxMethod<FormData>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((form) => ticketService.updateAssignee$(form).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ ticketDetail: { ...state.ticketDetail, assignee: response.data.assignee }, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured.');
                }
                })
            )))),
        updatePhoto: rxMethod<File>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((file) => userService.updateImage$(file).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ profile: response.data.user, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured');
                }
                })
            )))),
        updateUser: rxMethod<IUser>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((user) => userService.update$(user).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ profile: response.data.user, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured');
                }
                })
            )))),
        updatePassword: rxMethod<UpdatePassword>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((passwordRequest) => userService.updatePassword$(passwordRequest).pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, { loading: false, error: null });
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured');
                }
                })
            )))),
        toggleAccountLocked: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap(() => userService.toggleAccountLocked$().pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ profile: response.data.user, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured');
                }
                })
            )))),
        toggleAccountExpired: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap(() => userService.toggleAccountExpired$().pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ profile: response.data.user, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured');
                }
                })
            )))),
        toggleAccountEnabled: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap(() => userService.toggleAccountEnabled$().pipe(
                tapResponse({
                next: (response: IResponse) => {
                    patchState(store, (state) => ({ profile: response.data.user, loading: false, error: null }));
                    toastService.success(response.message);
                },
                error: (error: string) => {
                    patchState(store, { loading: false, error });
                    toastService.error(error ? error : 'An error occured');
                }
                })
            )))),
    enableMfa: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap(() => userService.enableMfa$().pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({ profile: response.data.user, loading: false, error: null }));
            toastService.success(response.message);
          },
          error: (error: string) => {
            patchState(store, { loading: false, error });
            toastService.error(error ? error : 'An error occured');
          }
        })
      )))),
    disableMfa: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap(() => userService.disableMfa$().pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({ profile: response.data.user, loading: false, error: null }));
            toastService.success(response.message);
          },
          error: (error: string) => {
            patchState(store, { loading: false, error });
            toastService.error(error ? error : 'An error occured');
          }
        })
      )))),
    updateRole: rxMethod<string>(pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap((role) => userService.updateRole$(role).pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({ profile: response.data.user, loading: false, error: null }));
            toastService.success(response.message);
          },
          error: (error: string) => {
            patchState(store, { loading: false, error });
            toastService.error(error ? error : 'An error occured');
          }
        })
      )))),
    getUsers: rxMethod<void>(pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap(() => userService.users$().pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({ users: response.data.users, loading: false, error: null }));
          },
          error: (error: string) => {
            toastService.error(error ? error : 'An error occured');
            patchState(store, { loading: false, error });
          }
        })
      )))),
    getUser: rxMethod<string>(pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap((userUuid) => userService.user$(userUuid).pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({ user: response.data.user, loading: false, error: null }));
          },
          error: (error: string) => {
            toastService.error(error ? error : 'An error occured');
            patchState(store, { loading: false, error });
          }
        })
        )))),
    getReport: rxMethod<any>(pipe(
      tap(() => patchState(store, (state) => ({ loading: true, error: null }))),
      switchMap((request) => ticketService.report$(request).pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({ report: response.data.tickets, loading: false, error: null }));
            //toastService.success(response.message);
          },
          error: (error: string) => {
            patchState(store, { loading: false, error });
            toastService.error(error ? error : 'An error occured.');
          }
        })
        )))),
    downloadReport: rxMethod<any>(pipe(
      tap(() => patchState(store, (state) => ({ loading: true, error: null }))),
      switchMap((request) => ticketService.downloadReport$(request).pipe(
        tapResponse({
          next: (response) => {
            saveAs(new File([response.body], response.headers.get('File-Name'), { type: `${response.headers.get('Content-Type')};charset=utf-8` }));
            patchState(store, (state) => ({ loading: false, error: null }));
            toastService.success('Report generated');
          },
          error: (error: string) => {
            patchState(store, { loading: false, error });
            toastService.error(error ? error : 'An error occured.');
          }
        })
        )))),
    sendMessage: rxMethod<FormData>(pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap((form) => notificationService.sendMessages$(form).pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({ messages: response.data.messages, loading: false, error: null }));
          },
          error: (error: string) => {
            toastService.error(error ? error : 'An error occured');
            patchState(store, { loading: false, error });
          }
        })
      )))),
    getConversation: rxMethod<string>(pipe(
      tap(() => patchState(store, { error: null, conversation: null, loading: true })),
      switchMap((conversationId) => notificationService.getConversation$(conversationId).pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => {
              return ({ conversation: response.data.conversation, messages: response.data.messages, loading: false, error: null });
            });
          },
          error: (error: string) => {
            toastService.error(error ? error : 'An error occured');
            patchState(store, { loading: false, error });
          }
        })
      ))
    )),
    replyToMessage: rxMethod<FormData>(pipe(
      tap(() => patchState(store, { error: null })),
      switchMap((form) => notificationService.replyToMessage$(form).pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({ conversation: [...state.conversation, response.data.message], loading: false, error: null }));
          },
          error: (error: string) => {
            toastService.error(error ? error : 'An error occured');
            patchState(store, { loading: false, error });
          }
        })
      )))),
        setCurrentPage(currentPage: number): void {
            patchState(store, (state) => ({ currentPage }));
        },
        setReportRequest(reportRequest: {}): void {
            patchState(store, (state) => ({ reportRequest }));
        }
    })),
    withHooks({
        onInit(store) {
            watchState(store, (state) => {
                console.log('Current state', state);
            })
        }
    })
);