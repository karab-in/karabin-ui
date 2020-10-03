import { Component } from 'inferno';
import { Site } from 'karabin-js-client';
import { i18n } from '../i18next';
import { T } from 'inferno-i18next';
import { repoUrl, isBrowser } from '../utils';
import { IsoData } from 'shared/interfaces';
import { HtmlTags } from './html-tags';

interface SilverUser {
  name: string;
  link?: string;
}

let general = [
  'Brendan',
  'mexicanhalloween',
  'William Moore',
  'Rachel Schmitz',
  'comradeda',
  'ybaumy',
  'dude in phx',
  'twilight loki',
  'Andrew Plaza',
  'Jonathan Cremin',
  'Arthur Nieuwland',
  'Ernest Wiśniewski',
  'HN',
  'Forrest Weghorst',
  'Andre Vallestero',
  'NotTooHighToHack',
];
let highlighted = ['DQW', 'DiscountFuneral', 'Oskenso Kashi', 'Alex Benishek'];
let silver: SilverUser[] = [
  {
    name: 'Redjoker',
    link: 'https://iww.org',
  },
];
// let gold = [];
// let latinum = [];

interface SponsorsState {
  site: Site;
}

export class Sponsors extends Component<any, SponsorsState> {
  private emptyState: SponsorsState = {
    site: undefined,
  };
  constructor(props: any, context: any) {
    super(props, context);
    this.state = this.emptyState;

    let isoData: IsoData;
    if (isBrowser()) {
      isoData = window.isoData;
    } else {
      isoData = this.context.router.staticContext;
    }

    this.state.site = isoData.site.site;
  }

  componentDidMount() {
    if (isBrowser()) {
      window.scrollTo(0, 0);
    }
  }

  get documentTitle(): string {
    return `${i18n.t('sponsors')} - ${this.state.site.name}`;
  }

  render() {
    return (
      <div class="container text-center">
        <HtmlTags
          title={this.documentTitle}
          path={this.context.router.route.match.url}
        />
        {this.topMessage()}
        {/*
        <hr />
        {this.sponsors()}
        <hr />
        {this.bitcoin()}
        */}
      </div>
    );
  }

  topMessage() {
    return (
      <div>
        <h5>{i18n.t('donate_to_lemmy')}</h5>
        <p>
          <T i18nKey="sponsor_message">
            #<a href={repoUrl}>#</a>
          </T>
        </p>
        <a class="btn btn-secondary" href="https://liberapay.com/Lemmy/">
          {i18n.t('support_on_liberapay')}
        </a>
        <a
          class="btn btn-secondary ml-2"
          href="https://www.patreon.com/dessalines"
        >
          {i18n.t('support_on_patreon')}
        </a>
        <a
          class="btn btn-secondary ml-2"
          href="https://opencollective.com/lemmy"
        >
          {i18n.t('support_on_open_collective')}
        </a>
      </div>
    );
  }
  sponsors() {
    return (
      <div class="container">
        <h5>{i18n.t('sponsors')}</h5>
        <p>{i18n.t('silver_sponsors')}</p>
        <div class="row justify-content-md-center card-columns">
          {silver.map(s => (
            <div class="card col-12 col-md-2">
              <div>
                {s.link ? (
                  <a href={s.link} target="_blank" rel="noopener">
                    💎 {s.name}
                  </a>
                ) : (
                  <div>💎 {s.name}</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <p>{i18n.t('general_sponsors')}</p>
        <div class="row justify-content-md-center card-columns">
          {highlighted.map(s => (
            <div class="card bg-primary col-12 col-md-2 font-weight-bold">
              <div>{s}</div>
            </div>
          ))}
          {general.map(s => (
            <div class="card col-12 col-md-2">
              <div>{s}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  bitcoin() {
    return (
      <div>
        <h5>{i18n.t('crypto')}</h5>
        <div class="table-responsive">
          <table class="table table-hover text-center">
            <tbody>
              <tr>
                <td>{i18n.t('bitcoin')}</td>
                <td>
                  <code>1Hefs7miXS5ff5Ck5xvmjKjXf5242KzRtK</code>
                </td>
              </tr>
              <tr>
                <td>{i18n.t('ethereum')}</td>
                <td>
                  <code>0x400c96c96acbC6E7B3B43B1dc1BB446540a88A01</code>
                </td>
              </tr>
              <tr>
                <td>{i18n.t('monero')}</td>
                <td>
                  <code>
                    41taVyY6e1xApqKyMVDRVxJ76sPkfZhALLTjRvVKpaAh2pBd4wv9RgYj1tSPrx8wc6iE1uWUfjtQdTmTy2FGMeChGVKPQuV
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
