import deezer
from deezer import exceptions as deezer_exceptions
from pytube import YouTube
from pytube import Search
from pytube import exceptions
from youtubesearchpython import *
from youtubesearchpython import VideosSearch
import redis
from io import BytesIO
import asyncio
import threading
import pymongo
from bson.objectid import ObjectId

class ApiRequests():

    def __init__(self) -> None:
        self.song_index = 0
        self.client = deezer.Client()
        self.redis_client =  redis.Redis(host='redis', port=6379, db=0)
        self.background_tasks = []
 
    async def api_is_works():
        response = {"message": "Up and running"}
        return response
    
    
    def search_engine(self, search : str):
        while(True):
            try:
                results = self.client.search(search)
                self.clear_redis_cache()
                data_package = []
                for result in results:
                    data = { 
                        "title"     : result.title, 
                        "duration"  : result.duration,
                        "cover"     : result.album.cover,
                        "artist"    : result.artist.name, 
                        "album"     : result.album.title,
                    }
                    self.set_metadata_cache(result.title,result.artist.name)
                    data_package.append(data)

                # thread = threading.Thread(target=self.download_comand)
                # thread.start()
                
                return data_package

            except deezer_exceptions.requests.ConnectionError:
                print(f'Content {search} have a conection error for deezer search, retrying')   


    def set_metadata_cache(self, title : str, artist : str):
        self.song_index += 1
        self.redis_client.set(self.song_index,f"{title} {artist}")

    # def download_comand(self):
    #     print("ok")
    #     asyncio.run(self.async_download_control())


    # async def async_download_control(self):
    #     for index in range(1,self.song_index+1):
    #         self.background_tasks.append(asyncio.create_task(self.song_engine_link(self.redis_client.get(index), index)))
            
    #     await asyncio.gather(*self.background_tasks)      
        
   


    def song_engine_link(self, request : str, index : int):
        print("search " + request)
        videosSearch = VideosSearch(request, limit = 1)
        url = videosSearch.result().get('result')[0].get('link')
        print("before " + str(url))

        while(True):
            try:
                fetcher = StreamURLFetcher()    
                video = Video.get(str(url))
                url = fetcher.get(video, itag=251)
                self.redis_client.set(f"{index}dw", url)
                break
            except Exception:
                print(f"{url} video with direct link have failed, trying again..")
    


    # async def download_song_to_cache(self, song_id : int) -> None:
    #     if song_id is not None:
    #         buffer = BytesIO()
    #         while(True):
    #             try:
    #                 query = self.redis_client.get(song_id).decode()
    #                 print(f"downloding..." + query)
    #                 sh_results = Search(query)
    #                 yt = YouTube(sh_results.results[0].watch_url)
    #                 yt.streams.filter(only_audio=True).order_by("abr").asc().first().stream_to_buffer(buffer)
    #                 buffer.seek(0)
    #                 dw_index = f"{song_id} + dw"
    #                 self.redis_client.set(dw_index, buffer.getvalue())
    #                 return None
    #             except exceptions.VideoUnavailable:
    #                 print(f'Content {query} is unavaialable, retrying.')  
    #             except KeyError:
    #                 print(f'Content {query} video keyError, retrying')
               
        
    def get_song_by_id(self, song_id : int):
        self.song_engine_link(self.redis_client.get(song_id).decode(), song_id)
        return self.redis_client.get(f"{song_id}dw").decode()
    #     song_cache = self.redis_client.get(f"{song_id} + dw")
    #     next_song_cache = self.redis_client.get(f"{song_id+1} + dw")

    #     if song_cache is not None and next_song_cache is None: 
    #         # executar a função em background 
    #         thread = threading.Thread(target=self.async_download_comand, args=(song_id,))
    #         thread.start()
    #         print('Sending and runnig background request')
    #         return BytesIO(song_cache)
    #     elif song_cache is None and next_song_cache is not None :
    #         self.async_download_comand(song_id)
    #     elif song_cache is None and next_song_cache is None:
    #         self.async_download_comand(song_id)
    #         return BytesIO(self.redis_client.get(f"{song_id} + dw"))
    #     else:
    #         return BytesIO(self.redis_client.get(f"{song_id} + dw"))

    # def async_download_comand(self, song_id : int):
    #     asyncio.run(self.index_control_redis(song_id))
  
    # async def index_control_redis(self, song_id : int):
    #     tasks = []
    #     for i in range(-1, 2, 1):
    #         if self.redis_client.get(f"{song_id-i} + dw") is None:
    #             if song_id-i > 0 and song_id-i <= self.song_index:
    #                 tasks.append(asyncio.create_task(self.download_song_to_cache(song_id-i)))

    #     await asyncio.gather(*tasks)        
    
    def clear_redis_cache(self) -> None:
        self.song_index = 0 
        self.background_tasks.clear()
        self.redis_client.flushall()

    def getTredingTops(self,):
        # Not working 
        ls_ed = self.client.list_editorials()
        for ed in ls_ed:
            print(ed.get_selection())

    
    # def create_user_playlist():
    #     cliente = pymongo.MongoClient("mongodb://localhost:27017/")
    #     db = cliente['spotify']
    #     collection = db['user_playlists']
    #     id = 1

    #     playlist = {"name": "Minha Playlist nº " + str(id), "songs": {}}
    #     collection.insert_one(playlist)

    #     return collection.find({}).sort("_id":-1).