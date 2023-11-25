import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler

async def fetch_event():
    print("Hello, World!")

async def main():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(job, 'interval', seconds=5)

    scheduler.start()

    try:
        while True:
            await asyncio.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()

if __name__ == '__main__':
    asyncio.run(main())