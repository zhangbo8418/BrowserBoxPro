import {DEBUG, CONFIG} from '../common.js';
import {s as R, c as X} from '../../node_modules/bang.html/src/vv/vanillaview.js';

  // Auxilliary view functions 
    const RESPONDABLE_MODALS = new Set([
      'alert',
      'confirm',
      'prompt',
      'beforeunload',
      'filechooser',
      'infobox',
      'auth',
      'intentPrompt'
    ]);
    const ModalRef = {
      alert: null, confirm: null, prompt: null, beforeunload: null,
      infobox: null, notice: null, auth: null, filechooser: null,
      intentPrompt: null
    };

  // Modals
    export function Modals(state) {
      DEBUG.debugModal && console.log('Modal', state.viewState.currentModal, new Error('stack').stack);
      try {
        const {currentModal} = state.viewState;
        // these are default values when there is no current Modal
        let msg = '',type = '', title = '', currentModalEl = false;
        let token = '';
        let requestId = '';
        let sessionId = '';
        let mode = '';
        let accept = '';
        let multiple = false;
        let submitText = '';
        let cancelText = '';
        let otherButton = null;
        let working = false;
        let url = '';

        if ( currentModal ) {
          // the defaults here are defaults when there *is* a current modal
          ({
            msg:msg = '空',
            type,
            token:token = '',
            url:url = '',
            title:title = '未命名',
            el:currentModalEl,
            requestId:requestId = '',
            mode:mode = '',
            sessionId:sessionId = '',
            accept: accept = '',
            submitText:submitText = '提交',
            cancelText:cancelText = '取消',
            otherButton:otherButton = null,
            working:working = false,
          } = currentModal);
          window.addEventListener('beforeunload', requestModalBeClosedFirst);
        } else {
          window.removeEventListener('beforeunload', requestModalBeClosedFirst);
        }

        if ( type == 'intentPrompt' ) {
          if ( ! url ) {
            throw new TypeError(`IntentPrompt modal requires a url`);
          } else {
            const Url = new URL(url);
            if ( Url.protocol == 'intent:' ) {
              if ( ( Url + '').includes('google.com/maps') ) {
                Url.protocol = 'https:';
              }
              url = Url;
            }
          }
        }

        if ( type == 'auth' && ! requestId ) {
          throw new TypeError(`Auth modal requires a requestId to send the response to`);
        }

        if ( type == 'filechooser' && !(mode && sessionId && token) ) {
          DEBUG.debugModal && console.log(currentModal);
          throw new TypeError(`File chooser modal requires both sessionId, mode and token`);
        }

        if ( mode == 'selectMultiple' ) {
          multiple = true;
        }

        return R`
          <aside class="modals ${currentModal ? 'active' : ''}" stylist="styleModals" click:capture=${click => closeModal(click, state)}>
            <article role=dialog bond=${el => ModalRef.alert = el} class="alert ${
                currentModalEl === ModalRef.alert ? 'open' : '' 
              }">
              <form method=dialog>
                <fieldset>
                  <legend><h1>警告！&ndash; 页面提示：</h1></legend>
                  <p class=message value=message>${msg||'您收到了一条警告。'}</p>
                  <p>
                    <button class=ok title="好的，我知道了。" value=ok>知道了</button>
                  </p>
                </fieldset>
              </form>
            </article>
            <article role=dialog bond=${el => ModalRef.confirm = el} class="confirm ${
                currentModalEl === ModalRef.confirm ? 'open' : '' 
              }">
              <form method=dialog>
                <fieldset>
                  <legend><h1>确认 &ndash; 页面询问：</h1></legend>
                  <p class=message value=message>${msg||'您被要求确认'}</p>
                  <p>
                    <button class=ok title="确认" value=ok>确认</button>
                    <button class=cancel title="拒绝" value=cancel>拒绝</button>
                  </p>
                </fieldset>
              </form>
            </article>
            <article role=dialog bond=${el => ModalRef.prompt = el} class="prompt ${
                currentModalEl === ModalRef.prompt ? 'open' : '' 
              }">
              <form method=dialog>
                <fieldset>
                  <legend><h1>提示 &ndash; 页面询问：</h1></legend>
                  <p class=message value=message>${msg||'请输入信息：'}</p>
                  <p>
                    <input type=text name=response>
                  </p>
                  <p>
                    <button class=ok title="发送" value=ok>发送</button>
                    <button class=cancel title="取消" value=cancel>取消</button>
                  </p>
                </fieldset>
              </form>
            </article>
            <article role=dialog bond=${el => ModalRef.beforeunload = el} class="beforeunload ${
                currentModalEl === ModalRef.beforeunload ? 'open' : '' 
              }">
              <form method=dialog>
                <fieldset>
                  <legend><h1>页面卸载时询问：</h1></legend>
                  <p class=message value=message>${msg||'您确定要离开吗？'}</p>
                  <p>
                    <button class=ok title="离开" value=ok>离开</button>
                    <button class=cancel title="停留" value=cancel>停留</button>
                  </p>
                </fieldset>
              </form>
            </article>
            <article role=dialog bond=${el => ModalRef.infobox = el} class="infobox ${
                currentModalEl === ModalRef.infobox ? 'open' : '' 
              }">
              <form method=dialog>
                <fieldset>
                  <legend><h1>&#x1f6c8; ${title || '信息'}</h1></legend>
                  <p>
                    <textarea 
                      readonly class=message value=message rows=${Math.ceil(msg.length/25)+1}
                    >${msg}</textarea>
                  </p>
                  <p>
                    <button class=ok title="知道了" value=ok>确定</button>
                  </p>
                </fieldset>
              </form>
            </article>
            <article role=dialog bond=${el => ModalRef.notice = el} class="notice ${
                currentModalEl === ModalRef.notice ? 'open' : '' 
              }">
              <form method=dialog>
                <fieldset>
                  <legend><h1>&#x1f6c8; ${title || '通知'}</h1></legend>
                  <p>
                  <p class=message value=message>${msg||'空通知'}</p>
                  <p>
                    <button class=ok title=确认 value=ok>确定</button>
                    ${otherButton ? X`<button title="${otherButton.title}" click=${otherButton.onclick}>${otherButton.title}</button>` : ''}
                  </p>
                </fieldset>
              </form>
            </article>
            <article role=dialog bond=${el => ModalRef.auth = el} class="auth ${
                currentModalEl === ModalRef.auth ? 'open' : '' 
              }">
              <form method=dialog>
                <fieldset>
                  <legend><h1>&#x1f512; ${title || '身份验证'}</h1></legend>
                  <p class=message value=message>${msg||'空通知'}</p>
                  <input type=hidden name=requestid value=${requestId}>
                  <p>
                    <input type=text 
                      autocomplete=username
                      name=username placeholder=用户名 maxlength=140>
                  <p>
                    <input type=password 
                      autocomplete=current-password
                      name=password placeholder=密码 maxlength=140>
                  <p>
                    <button click=${click => respondWithAuth(click, state)}>提交</button>
                    <button click=${click => respondWithCancel(click, state)}>取消</button>
                </fieldset>
              </form>
            </article>
            <article role=dialog bond=${el => ModalRef.filechooser = el} class="filechooser ${
                currentModalEl === ModalRef.filechooser ? 'open' : '' 
              }">
              <form method=POST action=/file enctype=multipart/form-data>
                <fieldset>
                  <legend><h1>&#x1f4c1; ${title || '文件上传'}</h1></legend>
                  <p class=message value=message>${msg||'空通知'}</p>
                  <input type=hidden name=sessionid value=${sessionId}>
                  <input type=hidden name=token value=${token}>
                  <p>
                    <label>
                      选择${multiple?'一个或多个文件':'一个文件'}。
                      <input type=file name=files ${multiple?'multiple':''} accept="${accept}">
                    </label>
                  <p>
                    <button 
                      ${working?'disabled':''} 
                      click=${click => chooseFile(click, state)}
                    >${submitText}</button>
                    <button 
                      ${working?'disabled':''} 
                      click=${click => cancelFileChooser(click, state)}
                    >${cancelText}</button>
                </fieldset>
              </form>
            </article>
            <article role=dialog bond=${el => ModalRef.intentPrompt = el} class="intent-prompt ${
                currentModalEl === ModalRef.intentPrompt ? 'open' : '' 
              }">
              <form method=GET action="${url}" target=_top submit=${submission => {
                  submission.preventDefault(); 
                  const target = CONFIG.useBlankWindowForProtocolLaunch ? 
                    globalThis.window.open("about:blank") 
                    : 
                    window.top
                  ;
                  setTimeout(() => {
                    window._voodoo_noUnloadDelay = true;
                    target.location.href = url;
                    setTimeout(() => window._voodoo_noUnloadDelay = false, 300);
                    DEBUG.debugIntentPrompts && console.log(target.location);
                  }, 300);
                }}>
                <fieldset>
                  <legend><h1>&#x2348; ${title || '打开应用'}</h1></legend>
                  <p class=message value=message>${
                    `此页面请求使用以下 URL 打开外部应用：${
                      url.slice(0,140) + (url.length > 140 ? '...' : '')
                    }`
                  }</p>
                <p>
                  <button type=reset>停止</button>
                  <button>打开外部应用</button>
                </p>
              </form>
            </article>
          </aside>
        `;
      } catch(e) {
        console.log("Modal error", e);
      }
    }

    function requestModalBeClosedFirst(unload) {
      const message = "请先关闭模态框";
      const obj = (unload || window.event);
      if ( obj ) obj.returnValue = message;
      return message;
    }

    async function chooseFile(click, state) {
      click.preventDefault();
      click.stopPropagation();
      const form = click.target.closest('form');
      const body = new FormData(form);
      const request = { 
        method: form.method,
        body
      };
      Object.assign(state.viewState.currentModal, {
        submitText: '上传中...',
        working: true
      });
      Modals(state);
      const resp = await globalThis.uberFetch(form.action, request).then(r => r.json());
      if ( resp.error ) {
        alert(resp.error);
      } else {
        DEBUG.val && console.log(`Success attached files`, resp); 
      }
      closeModal(click, state);
    }

    async function cancelFileChooser(click, state) {
      click.preventDefault();
      click.stopPropagation();
      const form = click.target.closest('form');
      form.reset();
      const body = new FormData(form);
      body.delete('files');
      const request = { 
        method: form.method,
        body
      };
      Object.assign(state.viewState.currentModal, {
        cancelText: '取消中...',
        working: true
      });
      Modals(state);
      const resp = await globalThis.uberFetch(form.action, request).then(r => r.json());
      if ( resp.error ) {
        alert(`发生错误`);
        console.log({resp});
      } else {
        DEBUG.val && console.log(`Success cancelling file attachment`, resp); 
      }
      closeModal(click, state);
    }

    function respondWithAuth(click, state) {
      click.preventDefault();
      click.stopPropagation();
      const form = click.target.closest('form'); 
      const data = new FormData(form);
      const requestId = data.get('requestid').slice(0,140);
      const username = data.get('username').slice(0,140);
      const password = data.get('password').slice(0,140);
      const authResponse = {
        username, 
        password,
        response: "ProvideCredentials"
      };
      state.H({
        synthetic: true,
        type: 'auth-response',
        requestId,
        authResponse
      });
      DEBUG.debugAuth && console.log({authResponse});
      closeModal(click, state);
    }

    function respondWithCancel(click, state) {
      click.preventDefault();
      click.stopPropagation();
      const form = click.target.closest('form'); 
      const data = new FormData(form);
      const requestId = data.get('requestid').slice(0,140);
      const authResponse = {
        response: "CancelAuth"
      };
      state.H({
        synthetic: true,
        type: 'auth-response',
        modalType: 'auth',
        requestId,
        authResponse
      });
      closeModal(click, state);
    }

    export function openModal({modal} = {}, state) {
      const {
          sessionId, mode, requestId, title, type, message:msg, defaultPrompt, url, otherButton,
          token
      } = modal;
      const currentModal = {type, token, mode, requestId, msg,el:ModalRef[type], sessionId, otherButton, title, url};
      state.viewState.currentModal = currentModal;
      localStorage.setItem('lastModal', JSON.stringify(modal));

      DEBUG.debugModal && console.log(state.viewState.currentModal);

      const modalDebug = {
        defaultPrompt, url, currentModal, ModalRef, state, title, type, otherButton, token
      };

      DEBUG.val >= DEBUG.med && Object.assign(self, {modalDebug});

      DEBUG.val >= DEBUG.med && console.log(`Will display modal ${type} with ${msg} on el:`, state.viewState.currentModal.el);

      Modals(state);
    }

    function closeModal(click, state) {
      if ( ! click.target.matches('button') ) return;

      const response = click.target.value || 'close';
      const data = click.target.closest('form')?.response?.value || '';

      const {sessionId} = state.viewState.currentModal;

      state.viewState.lastModal = state.viewState.currentModal;
      state.viewState.lastModal.modalResponse = response;

      const {type:modalType} = state.viewState.lastModal;

      if ( RESPONDABLE_MODALS.has(modalType) ) {
        const modalResponse = {
          synthetic: true,
          modalType,
          type: "respond-to-modal",
          response,
          sessionId,
          [modalType === 'prompt' ? 'promptText': 'data']: data
        };
        DEBUG.debugModal && console.log({modalResponse});
        state.H(modalResponse);
      }
      
      onlyCloseModal(state);
    }

    export function onlyCloseModal(state) {
      state.viewState.currentModal = null;

      setTimeout(() => Modals(state), 50);
    }

  // Permission request
    export function PermissionRequest({
      permission, request, page
    }) {
      return R`
        <article class="permission-request hidden">
          <h1>${permission}</h1>
          <p class=request>${page} 正在请求 ${permission} 权限。详细信息：${request}</p>
          <button class=grant>授予</button>
          <button class=deny>拒绝</button>
        </article>
      `;
    }

