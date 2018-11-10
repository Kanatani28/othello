import tornado.ioloop
import tornado.web
import tornado.websocket
import json
import tornado.httpserver
from tornado.web import url

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("hell world")

class GameHandler(tornado.websocket.WebSocketHandler):

    waiters = set()
    messages = []

    def open(self, *args, **kwargs):
        self.waiters.add(self)
        self.write_message({'message': self.messages})

    def on_message(self, message):
        message = json.loads(message)
        self.messages.append(message)
        for waiter in self.waiters:
            if waiter == self:
                continue
            waiter.write_message({'img_path': message['img_path'], 'message': message['message']})

    def on_close(self):
        self.waiters.remove(self)

class Application(tornado.web.Application):
    def __init__(self):
        
        tornado.web.Application.__init__(self,
                                        [
                                        url(r'/', MainHandler, name='index'),
                                        url(r'/game', GameHandler, name='game')
                                        ])
        


if __name__ == "__main__":
    app = Application()
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
