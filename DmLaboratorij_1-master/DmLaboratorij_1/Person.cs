using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Bson;

namespace DmLaboratorij_1
{
    public class Person
    {
        public ObjectId _id { get; set; }
        public string personId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
    }
}