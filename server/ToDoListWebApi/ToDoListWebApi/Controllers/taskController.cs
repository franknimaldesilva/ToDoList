using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using ToDoListStore;

namespace ToDoListWebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class taskController : ControllerBase
    {
        private readonly IStore _store;
        public taskController(IStore store)
        {
            _store = store;
        }
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            Console.WriteLine("Get");
            if (Request.Headers.ContainsKey("storeid"))
            {
                Console.WriteLine("Get " + Request.Headers["storeid"]);
                return Ok(JsonConvert.SerializeObject(_store.GetTaskList(Request.Headers["storeid"])));
            }
            return BadRequest();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(string id)
        {
            if (Request.Headers.ContainsKey("storeid") && !string.IsNullOrEmpty(id))
            {
                return Ok(JsonConvert.SerializeObject(_store.GetTask(Request.Headers["storeid"],id)));
            }
            return BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult> Post()
        {
            Console.WriteLine("Post");
            if (Request.Headers.ContainsKey("storeid") && this.Request.Body != null)
            {
                string taskstr = await new StreamReader(this.Request.Body).ReadToEndAsync();
                if (!string.IsNullOrEmpty(taskstr))
                {
                    Console.WriteLine("Post " + Request.Headers["storeid"] + " " + taskstr);
                    Dictionary<string, object> task = JsonConvert.DeserializeObject<Dictionary<string, object>>(taskstr);
                    if (task != null)
                    {
                        _store.AddTask(Request.Headers["storeid"], task);

                        return Ok();
                    }
                }
            }
            return BadRequest();
        }

        [HttpDelete]
        public async Task<ActionResult> Delete()
        {
            Console.WriteLine("Delete");

            if (Request.Headers.ContainsKey("storeid") && this.Request.Body != null)
            {
                string taskid = await new StreamReader(this.Request.Body).ReadToEndAsync();
                if (!string.IsNullOrEmpty(taskid))
                {
                    Console.WriteLine("Delete " + Request.Headers["storeid"] + " " + taskid);
                    _store.RemoveTask(Request.Headers["storeid"], taskid);
                    return Ok();
                   
                }
            }
            return BadRequest();
        }
    }
}
