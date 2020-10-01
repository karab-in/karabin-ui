import { Component, linkEvent } from 'inferno';
import { Subscription } from 'rxjs';
import {
  UserOperation,
  LoginResponse,
  PasswordChangeForm,
  WebSocketJsonResponse,
  Site,
} from 'karabin-js-client';
import { WebSocketService, UserService } from '../services';
import {
  wsJsonToRes,
  capitalizeFirstLetter,
  toast,
  setIsoData,
  isBrowser,
  wsSubscribe,
} from '../utils';
import { i18n } from '../i18next';
import { HtmlTags } from './html-tags';

interface State {
  passwordChangeForm: PasswordChangeForm;
  loading: boolean;
  site: Site;
}

export class PasswordChange extends Component<any, State> {
  private isoData = setIsoData(this.context);
  private subscription: Subscription;

  emptyState: State = {
    passwordChangeForm: {
      token: this.props.match.params.token,
      password: undefined,
      password_verify: undefined,
    },
    loading: false,
    site: this.isoData.site.site,
  };

  constructor(props: any, context: any) {
    super(props, context);

    this.state = this.emptyState;

    this.parseMessage = this.parseMessage.bind(this);
    this.subscription = wsSubscribe(this.parseMessage);
  }

  componentWillUnmount() {
    if (isBrowser()) {
      this.subscription.unsubscribe();
    }
  }

  get documentTitle(): string {
    return `${i18n.t('password_change')} - ${this.state.site.name}`;
  }

  render() {
    return (
      <div class="container">
        <HtmlTags
          title={this.documentTitle}
          path={this.context.router.route.match.url}
        />
        <div class="row">
          <div class="col-12 col-lg-6 offset-lg-3 mb-4">
            <h5>{i18n.t('password_change')}</h5>
            {this.passwordChangeForm()}
          </div>
        </div>
      </div>
    );
  }

  passwordChangeForm() {
    return (
      <form onSubmit={linkEvent(this, this.handlePasswordChangeSubmit)}>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">
            {i18n.t('new_password')}
          </label>
          <div class="col-sm-10">
            <input
              type="password"
              value={this.state.passwordChangeForm.password}
              onInput={linkEvent(this, this.handlePasswordChange)}
              class="form-control"
              required
            />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">
            {i18n.t('verify_password')}
          </label>
          <div class="col-sm-10">
            <input
              type="password"
              value={this.state.passwordChangeForm.password_verify}
              onInput={linkEvent(this, this.handleVerifyPasswordChange)}
              class="form-control"
              required
            />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-10">
            <button type="submit" class="btn btn-secondary">
              {this.state.loading ? (
                <svg class="icon icon-spinner spin">
                  <use xlinkHref="#icon-spinner"></use>
                </svg>
              ) : (
                capitalizeFirstLetter(i18n.t('save'))
              )}
            </button>
          </div>
        </div>
      </form>
    );
  }

  handlePasswordChange(i: PasswordChange, event: any) {
    i.state.passwordChangeForm.password = event.target.value;
    i.setState(i.state);
  }

  handleVerifyPasswordChange(i: PasswordChange, event: any) {
    i.state.passwordChangeForm.password_verify = event.target.value;
    i.setState(i.state);
  }

  handlePasswordChangeSubmit(i: PasswordChange, event: any) {
    event.preventDefault();
    i.state.loading = true;
    i.setState(i.state);

    WebSocketService.Instance.passwordChange(i.state.passwordChangeForm);
  }

  parseMessage(msg: WebSocketJsonResponse) {
    let res = wsJsonToRes(msg);
    if (msg.error) {
      toast(i18n.t(msg.error), 'danger');
      this.state.loading = false;
      this.setState(this.state);
      return;
    } else if (res.op == UserOperation.PasswordChange) {
      let data = res.data as LoginResponse;
      this.state = this.emptyState;
      this.setState(this.state);
      UserService.Instance.login(data);
      this.props.history.push('/');
    }
  }
}
