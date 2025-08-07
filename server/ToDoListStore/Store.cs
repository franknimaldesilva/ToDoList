using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;

namespace ToDoListStore
{
    public class Store : IStore
    {
        public Dictionary<string, List<Dictionary<string, object>>> taskSets { get; set; }
        public Store() {
            taskSets = new Dictionary<string, List<Dictionary<string, object>>>();
        }
        public void AddTask(string storeid, Dictionary<string, object> task)
        {
            List<Dictionary<string, object>> taskList;
            if (taskSets.ContainsKey(storeid))
            {
                taskList = taskSets[storeid];
                taskSets.Remove(storeid);
            }
            else
            {
                taskList = new List<Dictionary<string, object>>();
             
            }
            taskList = taskList.Where(t => t["id"].ToString() != task["id"].ToString()).ToList();
            taskList.Add(task);
            taskSets.Add(storeid, taskList);

        }

        public List<Dictionary<string, object>>  GetTaskList(string storeid)
        {
            List<Dictionary<string, object>> taskList;
            if (taskSets.ContainsKey(storeid))
            {
                return taskSets[storeid];
               
            }
            else
            {
                taskList = new List<Dictionary<string, object>>();
                taskSets.Add(storeid, taskList);
                return taskList;
            }
        }
        public Dictionary<string, object> GetTask(string storeid,string taskid)
        {
           
            if (taskSets.ContainsKey(storeid) && taskSets[storeid].Where(t => t["id"].ToString() == taskid).Count() > 0)
            {
                return taskSets[storeid].Where(t => t["id"].ToString() == taskid).First();

            }
            return new Dictionary<string, object>();
        }

        public void RemoveTask(string storeid, string taskId) {

           
            if (taskSets.ContainsKey(storeid))
            {
                List<Dictionary<string, object>> taskList = taskSets[storeid];
                taskSets.Remove(storeid);
                taskList = taskList.Where(task => task["id"].ToString() != taskId).ToList();
                taskSets.Add(storeid, taskList);
            }

        }



    }
}
