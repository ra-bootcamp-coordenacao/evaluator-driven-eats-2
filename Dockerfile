FROM cypress/browsers:node16.13.2-chrome97-ff96

RUN npm i -g npm@8

RUN chown -R node:node /root

USER node

RUN mkdir /root/.cache
