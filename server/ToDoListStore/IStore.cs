using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ToDoListStore
{
    public interface IStore
    {
        Dictionary<string,List<Dictionary<string,object>>> taskSets { get; set; }
        List<Dictionary<string, object>> GetTaskList(string storeid);
        Dictionary<string, object> GetTask(string storeid, string taskid);
        void AddTask(string storeid, Dictionary<string, object> task);
        void RemoveTask(string storeid, string taskId);
    }
}
