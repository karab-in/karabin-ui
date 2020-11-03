import { User } from 'karabin-js-client';
import { Helmet } from 'inferno-helmet';
import { Component } from 'inferno';

interface Props {
  user: User | undefined;
}

export class Theme extends Component<Props> {
  render() {
    const { user } = this.props;
    const hasUserTheme = user && user.theme !== 'browser';

    return (
      <Helmet>
        {hasUserTheme ? (
          <link
            rel="stylesheet"
            type="text/css"
            href={`/static/assets/css/themes/${user.theme}.min.css`}
          />
        ) : (
          [
            <link
              rel="stylesheet"
              type="text/css"
              href="/static/assets/css/themes/karabin.min.css"
              id="default-dark"
              media="(prefers-color-scheme: no-preference), (prefers-color-scheme: dark), (prefers-color-scheme: light)"
            />,
          ]
        )}
      </Helmet>
    );
  }
}
