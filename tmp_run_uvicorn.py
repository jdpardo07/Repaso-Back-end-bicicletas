import threading
import uvicorn
import time

config = uvicorn.Config('main:app', host='127.0.0.1', port=8000, log_level='debug')
server = uvicorn.Server(config)

def run():
    server.run()

if __name__ == '__main__':
    t = threading.Thread(target=run, daemon=True)
    print('Starting thread')
    t.start()
    for i in range(30):
        print('tick', i)
        time.sleep(1)
    print('done')
