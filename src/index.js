import http from 'http';
import Runner from './tasks/poll-id';

const runner = new Runner(null);

runner.run();
//
http.createServer((/* request, response */) => {}).listen(process.env.PORT || 5000);
