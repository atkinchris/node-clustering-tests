FROM node:14-alpine
ENV PORT=3000
COPY . .
EXPOSE ${PORT}
CMD ["npm", "run", "start"]
