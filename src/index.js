import http from 'http';
import Runner from './tasks/poll-id';

const runner = new Runner(null);

runner.run();

http.createServer((/* request,*/ response) => {
  response.write('hello');
}).listen(process.env.PORT || 5000);
