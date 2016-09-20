using System.Web.Http;
using MongoDB.Bson;
using MongoDB.Driver;
using DmLaboratorij_1.Models;
using System.Threading.Tasks;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using System.Web.Script.Serialization;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace DmLaboratorij_1.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MovieInfoController : ApiController
    {
        [HttpGet]
        [Route("api/MovieInfo/")]
        [ResponseType(typeof(MovieModel))]
        public async Task<List<MovieModel>> Get()
        {
            var mongoDbClient = new MongoClient("mongodb://127.0.0.1:27017");
            var mongoDbServer = mongoDbClient.GetDatabase("SocialNetworks");

            
            List<MovieModel> allMovies = new List<MovieModel>();
            var collection = mongoDbServer.GetCollection<BsonDocument>("MovieInfo");
            var filter = new BsonDocument();
            var result = await collection.Find(filter).ToListAsync();
            foreach (BsonDocument item in result)
            {
                MovieModel movie = new MovieModel();
                movie.themoviedb_id = item.GetElement("themoviedb_id").Value.ToString();
                movie.original_title = item.GetElement("original_title").Value.ToString();
                movie.overview = item.GetElement("overview").Value.ToString();
                movie.release_date = item.GetElement("release_date").Value.ToString();
                movie.vote_average = float.Parse(item.GetElement("vote_average").Value.ToString()); 
                movie.cast = item.GetElement("cast").Value.ToString();
                movie.crew = item.GetElement("crew").Value.ToString();
                movie.trailer = item.GetElement("trailer").Value.ToString();
                movie.genreIDs = item.GetElement("genreIDs").Value.ToString();
                movie.poster_url = item.GetElement("poster_url").Value.ToString();
                allMovies.Add(movie);
            }
            
            var json = new JavaScriptSerializer().Serialize(allMovies);
            return allMovies;
        }


        [HttpGet]
        [Route("api/MovieInfo/{id}")]
        [ResponseType(typeof(MovieModel))]
        public async Task<List<MovieModel>> Get(string id)
        {
            string[] temp;
            temp = id.Split(',');
            var mongoDbClient = new MongoClient("mongodb://127.0.0.1:27017");
            var mongoDbServer = mongoDbClient.GetDatabase("SocialNetworks");

            List<MovieModel> selectedMovies = new List<MovieModel>();
            var collection = mongoDbServer.GetCollection<BsonDocument>("MovieInfo");
            if (int.Parse(temp[0]) == 0)
            {
                var filter = Builders<BsonDocument>.Filter.Eq("genreIDs", temp[1]) & Builders<BsonDocument>.Filter.Eq("genreIDs", temp[2]) & Builders<BsonDocument>.Filter.Eq("genreIDs", temp[3]);
                var result = await collection.Find(filter).Limit(int.Parse(temp[4])).Sort(Builders<BsonDocument>.Sort.Ascending("vote_avarage").Descending("release_date")).ToListAsync();
                foreach (BsonDocument item in result)
                {
                    MovieModel movie = new MovieModel();
                    movie.themoviedb_id = item.GetElement("themoviedb_id").Value.ToString();
                    movie.original_title = item.GetElement("original_title").Value.ToString();
                    movie.overview = item.GetElement("overview").Value.ToString();
                    movie.release_date = item.GetElement("release_date").Value.ToString();
                    movie.vote_average = float.Parse(item.GetElement("vote_average").Value.ToString());
                    movie.cast = item.GetElement("cast").Value.ToString();
                    movie.crew = item.GetElement("crew").Value.ToString();
                    movie.trailer = item.GetElement("trailer").Value.ToString();
                    movie.genreIDs = item.GetElement("genreIDs").Value.ToString();
                    movie.poster_url = item.GetElement("poster_url").Value.ToString();
                    selectedMovies.Add(movie);
                }
            }
            else
            {
                var filter = Builders<BsonDocument>.Filter.Eq("genreIDs", temp[1]);
                var result = await collection.Find(filter).Limit(50).Sort(Builders<BsonDocument>.Sort.Ascending("vote_avarage").Descending("release_date")).ToListAsync();
                foreach (BsonDocument item in result)
                {
                    MovieModel movie = new MovieModel();
                    movie.themoviedb_id = item.GetElement("themoviedb_id").Value.ToString();
                    movie.original_title = item.GetElement("original_title").Value.ToString();
                    movie.overview = item.GetElement("overview").Value.ToString();
                    movie.release_date = item.GetElement("release_date").Value.ToString();
                    movie.vote_average = float.Parse(item.GetElement("vote_average").Value.ToString());
                    movie.cast = item.GetElement("cast").Value.ToString();
                    movie.crew = item.GetElement("crew").Value.ToString();
                    movie.trailer = item.GetElement("trailer").Value.ToString();
                    movie.genreIDs = item.GetElement("genreIDs").Value.ToString();
                    movie.poster_url = item.GetElement("poster_url").Value.ToString();
                    selectedMovies.Add(movie);
                }

            }
            var json = new JavaScriptSerializer().Serialize(selectedMovies);
            return selectedMovies;
        }


        // POST api/values
        [HttpPost]
        [Route("api/MovieInfo/")]
        public void Post(MovieModel model)
        {
            var mongoDbClient = new MongoClient("mongodb://127.0.0.1:27017");
            var mongoDbServer = mongoDbClient.GetDatabase("SocialNetworks");
            BsonArray arr = new BsonArray();
            dynamic jobj = JsonConvert.DeserializeObject<dynamic>(model.genreIDs.ToString());
            foreach (var item in jobj)
            {
                foreach(var subitem in item)
                {
                    arr.Add(subitem.ID.ToString());
                }
            }

            var document = new BsonDocument
            {
                { "themoviedb_id",  model.themoviedb_id  },
                { "original_title",  model.original_title  },
                { "overview",  model.overview  },
                { "release_date", model.release_date  },
                { "vote_average", model.vote_average  },
                { "cast",  model.cast  },
                { "crew",  model.crew  },
                { "trailer",  model.trailer  },
                { "poster_url", model.poster_url},
                { "genreIDs",  arr },
            };

            var collection = mongoDbServer.GetCollection<BsonDocument>("MovieInfo");
            collection.InsertOneAsync(document);

        }
    }
}
