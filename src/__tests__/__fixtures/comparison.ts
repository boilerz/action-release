import { File } from '../../git-helper';

export const files: File[] = [
  {
    sha: 'dd8414055b7929c8f5fea512065f08a6198055d8',
    filename: 'package.json',
    status: 'modified',
    additions: 3,
    deletions: 3,
    changes: 6,
    blob_url:
      'https://github.com/boilerz/super-server-auth-core/blob/8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14/package.json',
    raw_url:
      'https://github.com/boilerz/super-server-auth-core/raw/8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14/package.json',
    contents_url:
      'https://api.github.com/repos/boilerz/super-server-auth-core/contents/package.json?ref=8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14',
    patch:
      '@@ -1,6 +1,6 @@\n' +
      ' {\n' +
      '   "name": "@boilerz/super-server-auth-core",\n' +
      '-  "version": "1.6.12",\n' +
      '+  "version": "1.6.13",\n' +
      '   "repository": "git@github.com:boilerz/super-server-auth-core.git",\n' +
      '   "author": "boilerz",\n' +
      '   "description": "Core module for authentication support on super server",\n' +
      '@@ -16,7 +16,7 @@\n' +
      '   },\n' +
      '   "peerDependencies": {\n' +
      '     "@boilerz/amqp-helper": "^1.1.0",\n' +
      '-    "@boilerz/logger": "^1.1.8",\n' +
      '+    "@boilerz/logger": "^1.1.11",\n' +
      '     "@typegoose/typegoose": "^7.4.2",\n' +
      '     "class-validator": "^0.13.1",\n' +
      '     "dayjs": "^1.10.4",\n' +
      '@@ -29,7 +29,7 @@\n' +
      '     "@boilerz/amqp-helper": "^1.1.0",\n' +
      '     "@boilerz/build-tools": "^1.4.6",\n' +
      '     "@boilerz/eslint-config": "^2.0.3",\n' +
      '-    "@boilerz/logger": "^1.1.8",\n' +
      '+    "@boilerz/logger": "^1.1.11",\n' +
      '     "@boilerz/mongoose-helper": "^1.2.5",\n' +
      '     "@boilerz/prettier-config": "^1.0.3",\n' +
      '     "@boilerz/super-server": "^1.6.7",',
  },
  {
    sha: 'b71840e1c30457acaba3a18b0b2fda0e303b18a3',
    filename: 'yarn.lock',
    status: 'modified',
    additions: 4,
    deletions: 4,
    changes: 8,
    blob_url:
      'https://github.com/boilerz/super-server-auth-core/blob/8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14/yarn.lock',
    raw_url:
      'https://github.com/boilerz/super-server-auth-core/raw/8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14/yarn.lock',
    contents_url:
      'https://api.github.com/repos/boilerz/super-server-auth-core/contents/yarn.lock?ref=8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14',
    patch:
      '@@ -332,10 +332,10 @@\n' +
      '     eslint-plugin-react "^7.22.0"\n' +
      '     eslint-plugin-react-hooks "^4.2.0"\n' +
      ' \n' +
      '-"@boilerz/logger@^1.1.8":\n' +
      '-  version "1.1.8"\n' +
      '-  resolved "https://registry.yarnpkg.com/@boilerz/logger/-/logger-1.1.8.tgz#4f70e24fbca572038a67e77add60f71f5712cd81"\n' +
      '-  integrity sha512-0djrm0qXiYB2DdcZWUnW/TP5EhkK+trZhf/bANR9jNfEf04XwA/h4VGeXlKUN/PrZRXcZC0UoJwhW5tTKI6XkA==\n' +
      '+"@boilerz/logger@^1.1.11":\n' +
      '+  version "1.1.11"\n' +
      '+  resolved "https://registry.yarnpkg.com/@boilerz/logger/-/logger-1.1.11.tgz#340d50c58e245613e95b76ac75d9bd8c9c0fbea1"\n' +
      '+  integrity sha512-c2Mkjl0JqUcYfvPUfV6DR184Xf3RpHNXmJ93INi8ZPuHtzigoA6S6zFNby0UkuusE2pbEezyG5sdJuyzPdDsjw==\n' +
      '   dependencies:\n' +
      '     "@sentry/types" "^6.0.1"\n' +
      '     "@types/bunyan" "^1.8.6"',
  },
];

export const commits = [
  {
    sha: '7f12f514ece218a16eb79b9513f6745279425f07',
    node_id:
      'MDY6Q29tbWl0MjY1ODA5MTA3OjdmMTJmNTE0ZWNlMjE4YTE2ZWI3OWI5NTEzZjY3NDUyNzk0MjVmMDc=',
    commit: {
      author: {
        name: 'dependabot[bot]',
        email: '49699333+dependabot[bot]@users.noreply.github.com',
        date: '2021-01-29T15:12:48Z',
      },
      committer: {
        name: 'GitHub',
        email: 'noreply@github.com',
        date: '2021-01-29T15:12:48Z',
      },
      message:
        ':arrow_up: Bump @boilerz/logger from 1.1.8 to 1.1.11\n\nBumps [@boilerz/logger](https://github.com/boilerz/logger) from 1.1.8 to 1.1.11.\n- [Release notes](https://github.com/boilerz/logger/releases)\n- [Commits](https://github.com/boilerz/logger/compare/v1.1.8...v1.1.11)\n\nSigned-off-by: dependabot[bot] <support@github.com>',
      tree: {
        sha: '2e516bf3ac3b5a2d5c0dbf780b4093e7cecf38c8',
        url: 'https://api.github.com/repos/boilerz/super-server-auth-core/git/trees/2e516bf3ac3b5a2d5c0dbf780b4093e7cecf38c8',
      },
      url: 'https://api.github.com/repos/boilerz/super-server-auth-core/git/commits/7f12f514ece218a16eb79b9513f6745279425f07',
      comment_count: 0,
      verification: {
        verified: true,
        reason: 'valid',
        signature:
          '-----BEGIN PGP SIGNATURE-----\n\nwsBcBAABCAAQBQJgFCXwCRBK7hj4Ov3rIwAAdHIIAHlsgRYckY4TsguTCHYri7v7\n1pjdZb5VG1FhW5qHlCxcOgWaI8rJUUt3OaHwWCqi6iNoqV/vbTpU6CqZIGisxq49\npecbnK6RCv7TMiRgVhwmNa4qaUoXF+QgbUQjn4xT7OkNDeunqem6kX4x2MGjgRRL\nopDB+xyt/DqMPMmuqj69bQhrWQ2zbIwDgrnayydaksFF6HRL+LNAhrX/0qLtWO9v\nmaaiRQjuGo+qhau1EvUKBRHp2mz+5rcJ//nsPxR+s9K7alEVIWFe34yMe+v/cJnq\nD+q+f1TcKqmurkJrpG3NUOgRuFtwo/KTsWPbfuQg716np2SPDmnhvrDsveVqMCw=\n=8WlT\n-----END PGP SIGNATURE-----\n',
        payload:
          'tree 2e516bf3ac3b5a2d5c0dbf780b4093e7cecf38c8\nparent b147bfe901ae3ce632c5c9e52ef3258aac09844e\nauthor dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com> 1611933168 +0000\ncommitter GitHub <noreply@github.com> 1611933168 +0000\n\n:arrow_up: Bump @boilerz/logger from 1.1.8 to 1.1.11\n\nBumps [@boilerz/logger](https://github.com/boilerz/logger) from 1.1.8 to 1.1.11.\n- [Release notes](https://github.com/boilerz/logger/releases)\n- [Commits](https://github.com/boilerz/logger/compare/v1.1.8...v1.1.11)\n\nSigned-off-by: dependabot[bot] <support@github.com>',
      },
    },
    url: 'https://api.github.com/repos/boilerz/super-server-auth-core/commits/7f12f514ece218a16eb79b9513f6745279425f07',
    html_url:
      'https://github.com/boilerz/super-server-auth-core/commit/7f12f514ece218a16eb79b9513f6745279425f07',
    comments_url:
      'https://api.github.com/repos/boilerz/super-server-auth-core/commits/7f12f514ece218a16eb79b9513f6745279425f07/comments',
    author: {
      login: 'dependabot[bot]',
      id: 49699333,
      node_id: 'MDM6Qm90NDk2OTkzMzM=',
      avatar_url: 'https://avatars.githubusercontent.com/in/29110?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/dependabot%5Bbot%5D',
      html_url: 'https://github.com/apps/dependabot',
      followers_url:
        'https://api.github.com/users/dependabot%5Bbot%5D/followers',
      following_url:
        'https://api.github.com/users/dependabot%5Bbot%5D/following{/other_user}',
      gists_url:
        'https://api.github.com/users/dependabot%5Bbot%5D/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/dependabot%5Bbot%5D/starred{/owner}{/repo}',
      subscriptions_url:
        'https://api.github.com/users/dependabot%5Bbot%5D/subscriptions',
      organizations_url:
        'https://api.github.com/users/dependabot%5Bbot%5D/orgs',
      repos_url: 'https://api.github.com/users/dependabot%5Bbot%5D/repos',
      events_url:
        'https://api.github.com/users/dependabot%5Bbot%5D/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/dependabot%5Bbot%5D/received_events',
      type: 'Bot',
      site_admin: false,
    },
    committer: {
      login: 'web-flow',
      id: 19864447,
      node_id: 'MDQ6VXNlcjE5ODY0NDQ3',
      avatar_url: 'https://avatars.githubusercontent.com/u/19864447?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/web-flow',
      html_url: 'https://github.com/web-flow',
      followers_url: 'https://api.github.com/users/web-flow/followers',
      following_url:
        'https://api.github.com/users/web-flow/following{/other_user}',
      gists_url: 'https://api.github.com/users/web-flow/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/web-flow/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/web-flow/subscriptions',
      organizations_url: 'https://api.github.com/users/web-flow/orgs',
      repos_url: 'https://api.github.com/users/web-flow/repos',
      events_url: 'https://api.github.com/users/web-flow/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/web-flow/received_events',
      type: 'User',
      site_admin: false,
    },
    parents: [
      {
        sha: 'b147bfe901ae3ce632c5c9e52ef3258aac09844e',
        url: 'https://api.github.com/repos/boilerz/super-server-auth-core/commits/b147bfe901ae3ce632c5c9e52ef3258aac09844e',
        html_url:
          'https://github.com/boilerz/super-server-auth-core/commit/b147bfe901ae3ce632c5c9e52ef3258aac09844e',
      },
    ],
  },
  {
    sha: '7c3c7ff912a979ace1abba9aef54f9d539c5dbd3',
    node_id:
      'MDY6Q29tbWl0MjY1ODA5MTA3OjdjM2M3ZmY5MTJhOTc5YWNlMWFiYmE5YWVmNTRmOWQ1MzljNWRiZDM=',
    commit: {
      author: {
        name: 'boilerz-bot',
        email: '77937117+boilerz-bot@users.noreply.github.com',
        date: '2021-01-29T15:15:11Z',
      },
      committer: {
        name: 'GitHub',
        email: 'noreply@github.com',
        date: '2021-01-29T15:15:11Z',
      },
      message:
        ':twisted_rightwards_arrows: Merge pull request #263 - ⬆️ Bump @boilerz/logger from 1.1.8 to 1.1.11',
      tree: {
        sha: '72b1d3bd1189bcb02c40f85e37b082bcb74cc6fe',
        url: 'https://api.github.com/repos/boilerz/super-server-auth-core/git/trees/72b1d3bd1189bcb02c40f85e37b082bcb74cc6fe',
      },
      url: 'https://api.github.com/repos/boilerz/super-server-auth-core/git/commits/7c3c7ff912a979ace1abba9aef54f9d539c5dbd3',
      comment_count: 0,
      verification: {
        verified: true,
        reason: 'valid',
        signature:
          '-----BEGIN PGP SIGNATURE-----\n\nwsBcBAABCAAQBQJgFCZ/CRBK7hj4Ov3rIwAAdHIIAFVSIsT5xnc7by2RPLR9il1a\nnnxzezCth2d4uH4xPtjViHbGtiOwmwwMhjVvj6VPUC0JVAUL2G7teK6zygV+qCiw\nmvAIDWcV5LhoQdMMhvkM6tp30GAfJK/dj2GYhUr3i292hEfigdTnZzFaOQf1JiDx\nHRAqVnK2763CWqMzfs9w6tA5ZNUQcJTQiInG8qTZUYzxLGI+YbJVzxhP6+EOcBaJ\naLNkDe9PztL8cel4+5LeCKuf+KsFezxuan9yEKGXYBcYTfpJPGygKRSrfc/C6DpJ\nijTidHcVCaNeoE+v+YwMvvpS+/QIF48zfoA6Jm+cIRELngQt/T/AMbzsYL+Iq7A=\n=P0xf\n-----END PGP SIGNATURE-----\n',
        payload:
          'tree 72b1d3bd1189bcb02c40f85e37b082bcb74cc6fe\nparent b49c5015e31c652d55ca7be1edbde0b0a7e58ed2\nparent 7f12f514ece218a16eb79b9513f6745279425f07\nauthor boilerz-bot <77937117+boilerz-bot@users.noreply.github.com> 1611933311 +0100\ncommitter GitHub <noreply@github.com> 1611933311 +0100\n\n:twisted_rightwards_arrows: Merge pull request #263 - ⬆️ Bump @boilerz/logger from 1.1.8 to 1.1.11\n\n',
      },
    },
    url: 'https://api.github.com/repos/boilerz/super-server-auth-core/commits/7c3c7ff912a979ace1abba9aef54f9d539c5dbd3',
    html_url:
      'https://github.com/boilerz/super-server-auth-core/commit/7c3c7ff912a979ace1abba9aef54f9d539c5dbd3',
    comments_url:
      'https://api.github.com/repos/boilerz/super-server-auth-core/commits/7c3c7ff912a979ace1abba9aef54f9d539c5dbd3/comments',
    author: {
      login: 'boilerz-bot',
      id: 77937117,
      node_id: 'MDQ6VXNlcjc3OTM3MTE3',
      avatar_url: 'https://avatars.githubusercontent.com/u/77937117?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/boilerz-bot',
      html_url: 'https://github.com/boilerz-bot',
      followers_url: 'https://api.github.com/users/boilerz-bot/followers',
      following_url:
        'https://api.github.com/users/boilerz-bot/following{/other_user}',
      gists_url: 'https://api.github.com/users/boilerz-bot/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/boilerz-bot/starred{/owner}{/repo}',
      subscriptions_url:
        'https://api.github.com/users/boilerz-bot/subscriptions',
      organizations_url: 'https://api.github.com/users/boilerz-bot/orgs',
      repos_url: 'https://api.github.com/users/boilerz-bot/repos',
      events_url: 'https://api.github.com/users/boilerz-bot/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/boilerz-bot/received_events',
      type: 'User',
      site_admin: false,
    },
    committer: {
      login: 'web-flow',
      id: 19864447,
      node_id: 'MDQ6VXNlcjE5ODY0NDQ3',
      avatar_url: 'https://avatars.githubusercontent.com/u/19864447?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/web-flow',
      html_url: 'https://github.com/web-flow',
      followers_url: 'https://api.github.com/users/web-flow/followers',
      following_url:
        'https://api.github.com/users/web-flow/following{/other_user}',
      gists_url: 'https://api.github.com/users/web-flow/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/web-flow/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/web-flow/subscriptions',
      organizations_url: 'https://api.github.com/users/web-flow/orgs',
      repos_url: 'https://api.github.com/users/web-flow/repos',
      events_url: 'https://api.github.com/users/web-flow/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/web-flow/received_events',
      type: 'User',
      site_admin: false,
    },
    parents: [
      {
        sha: 'b49c5015e31c652d55ca7be1edbde0b0a7e58ed2',
        url: 'https://api.github.com/repos/boilerz/super-server-auth-core/commits/b49c5015e31c652d55ca7be1edbde0b0a7e58ed2',
        html_url:
          'https://github.com/boilerz/super-server-auth-core/commit/b49c5015e31c652d55ca7be1edbde0b0a7e58ed2',
      },
      {
        sha: '7f12f514ece218a16eb79b9513f6745279425f07',
        url: 'https://api.github.com/repos/boilerz/super-server-auth-core/commits/7f12f514ece218a16eb79b9513f6745279425f07',
        html_url:
          'https://github.com/boilerz/super-server-auth-core/commit/7f12f514ece218a16eb79b9513f6745279425f07',
      },
    ],
  },
  {
    sha: '8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14',
    node_id:
      'MDY6Q29tbWl0MjY1ODA5MTA3OjhmY2ZkOGM3YWE3YmQxYzFkY2M3NDU3ZDM4OWU1ZTA4ZWU5Y2JlMTQ=',
    commit: {
      author: {
        name: 'boilerz-bot',
        email: '77937117+boilerz-bot@users.noreply.github.com',
        date: '2021-01-29T15:17:00Z',
      },
      committer: {
        name: 'boilerz-bot',
        email: '77937117+boilerz-bot@users.noreply.github.com',
        date: '2021-01-29T15:17:00Z',
      },
      message: ':bookmark: v1.6.13',
      tree: {
        sha: '71901bbecdf353252a6a3428f6850345874c5b92',
        url: 'https://api.github.com/repos/boilerz/super-server-auth-core/git/trees/71901bbecdf353252a6a3428f6850345874c5b92',
      },
      url: 'https://api.github.com/repos/boilerz/super-server-auth-core/git/commits/8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14',
      comment_count: 0,
      verification: {
        verified: true,
        reason: 'valid',
        signature:
          '-----BEGIN PGP SIGNATURE-----\n\niQIzBAABCgAdFiEEaetEFGdfEtPR+IUkVGuXGvG5g+gFAmAUJuwACgkQVGuXGvG5\ng+i7UQ//TS2JJcLTRM4h3BklW1pbD2+3/kN44UWYMKf/Ogm4kl6nDinksKoA9e3u\n5hiNFJstGPF6YV//zvx0BaZb7BaPPTEuDYcGiO7xswKIdvdX2khcfkL4qqDyeEf0\nJJP1nZTpIH9+XO5eTpfmxvmsTiFisNRWRdfFAvjW9ES8ll497qfTICuO7YQYXXbs\nIeZeWsaZKKa3tHMPIjUQdzLybiB6SGfE+09/DEWr/6Z8zM3DKyxFupbDTIHTwt15\nhYXttsb7lHivitKX600kWGw5HUVX1xLX68spht7fXuptYDzhDaTrRGMovF9IJ5Ak\nc7R4aTlDRhKmtuf1+K/pYBXZdn21a63139APgkarGBEQ02NO+Yf39UFD8W6zdgTk\n7ECk6N9iwExDMz66q6kgX+SUzVnq9aIlqFWTISTvYKzAzHIfdFnQ4M3oC33/9Lix\njxwBkrryULimLhKcP0owDf1TA2v5lk5yXiTShVIaX55r0KpBtYwYlnALGdNM/cdO\nAo20kyMZszL4RYb7OwUEutB6PxifrpWyc8EN8uqqLIArandxEof/51NhS9XLH1et\nHlv/pznwkEPAm3Nt/F3gyQbx505wfx2NW1V51yfKyep4bZBdjIcM5TeCC1tljJsz\nqP6IfDF567KoNEVvPdyqJCeTc/xTvpeCzYa7LKF0PqAr2kB0CR4=\n=/VD/\n-----END PGP SIGNATURE-----',
        payload:
          'tree 71901bbecdf353252a6a3428f6850345874c5b92\nparent 7c3c7ff912a979ace1abba9aef54f9d539c5dbd3\nauthor boilerz-bot <77937117+boilerz-bot@users.noreply.github.com> 1611933420 +0000\ncommitter boilerz-bot <77937117+boilerz-bot@users.noreply.github.com> 1611933420 +0000\n\n:bookmark: v1.6.13\n',
      },
    },
    url: 'https://api.github.com/repos/boilerz/super-server-auth-core/commits/8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14',
    html_url:
      'https://github.com/boilerz/super-server-auth-core/commit/8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14',
    comments_url:
      'https://api.github.com/repos/boilerz/super-server-auth-core/commits/8fcfd8c7aa7bd1c1dcc7457d389e5e08ee9cbe14/comments',
    author: {
      login: 'boilerz-bot',
      id: 77937117,
      node_id: 'MDQ6VXNlcjc3OTM3MTE3',
      avatar_url: 'https://avatars.githubusercontent.com/u/77937117?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/boilerz-bot',
      html_url: 'https://github.com/boilerz-bot',
      followers_url: 'https://api.github.com/users/boilerz-bot/followers',
      following_url:
        'https://api.github.com/users/boilerz-bot/following{/other_user}',
      gists_url: 'https://api.github.com/users/boilerz-bot/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/boilerz-bot/starred{/owner}{/repo}',
      subscriptions_url:
        'https://api.github.com/users/boilerz-bot/subscriptions',
      organizations_url: 'https://api.github.com/users/boilerz-bot/orgs',
      repos_url: 'https://api.github.com/users/boilerz-bot/repos',
      events_url: 'https://api.github.com/users/boilerz-bot/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/boilerz-bot/received_events',
      type: 'User',
      site_admin: false,
    },
    committer: {
      login: 'boilerz-bot',
      id: 77937117,
      node_id: 'MDQ6VXNlcjc3OTM3MTE3',
      avatar_url: 'https://avatars.githubusercontent.com/u/77937117?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/boilerz-bot',
      html_url: 'https://github.com/boilerz-bot',
      followers_url: 'https://api.github.com/users/boilerz-bot/followers',
      following_url:
        'https://api.github.com/users/boilerz-bot/following{/other_user}',
      gists_url: 'https://api.github.com/users/boilerz-bot/gists{/gist_id}',
      starred_url:
        'https://api.github.com/users/boilerz-bot/starred{/owner}{/repo}',
      subscriptions_url:
        'https://api.github.com/users/boilerz-bot/subscriptions',
      organizations_url: 'https://api.github.com/users/boilerz-bot/orgs',
      repos_url: 'https://api.github.com/users/boilerz-bot/repos',
      events_url: 'https://api.github.com/users/boilerz-bot/events{/privacy}',
      received_events_url:
        'https://api.github.com/users/boilerz-bot/received_events',
      type: 'User',
      site_admin: false,
    },
    parents: [
      {
        sha: '7c3c7ff912a979ace1abba9aef54f9d539c5dbd3',
        url: 'https://api.github.com/repos/boilerz/super-server-auth-core/commits/7c3c7ff912a979ace1abba9aef54f9d539c5dbd3',
        html_url:
          'https://github.com/boilerz/super-server-auth-core/commit/7c3c7ff912a979ace1abba9aef54f9d539c5dbd3',
      },
    ],
  },
];

export const comparison = { files, commits };
