FROM alpine

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn \
      npm


# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v13.5.0 works with Chromium 100.
RUN yarn add puppeteer@13.5.0

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
#USER pptruser

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=pptruser:pptruser src/app/package*.json /app

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=pptruser:pptruser api/src/app /app


RUN npm install -g npm@9.1.1
RUN npm install

EXPOSE 8080

USER pptruser

CMD [ "node", "index.js" ]


#
#
#FROM ubuntu:latest
#
#RUN apt-get update && apt-get -y install cron apt-utils rsyslog curl
#
#WORKDIR /
##COPY mailsend-go_1.0.10_linux-64bit.deb /tmp
##RUN chmod ugo+rwx /tmp/mailsend-go_1.0.10_linux-64bit.deb
##RUN dpkg -i /tmp/mailsend-go_1.0.10_linux-64bit.deb
#
#RUN touch /etc/crontab /etc/cron.*/*
#
#### Put code nodeJS code here
#RUN mkdir /script
##COPY main.sh /etc/cron.hourly/main
##COPY main.sh /script
##RUN chmod ugo+rwx /etc/cron.hourly/main
#
## Create the log file to be able to run tail
#RUN touch /var/log/cron.log
#RUN chmod 644 /etc/crontab
#RUN echo 'SHELL=/bin/sh' > /etc/crontab
#RUN echo 'PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin' >> /etc/crontab
#RUN echo '0 * * * * root /script/main.sh >> /var/log/cron.log 2>&1' >> /etc/crontab
#RUN echo '#empty line' >> /etc/crontab
#
## Run the command on container startup
#CMD cron && tail -f /var/log/cron.log