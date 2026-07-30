// import EditSchedule from "./EditSchedule";

function TimeSchedule({addSchedule,DeleteCheckFlag, editCheckFlag, onCheckChange,editSchedule}:{addSchedule:{id:number,scheduleContent: string, startTime: string, endTime: string}[], deleteSchedule: (id: number) => void, editSchedule:(id:number)=>void,DeleteCheckFlag: boolean, editCheckFlag:boolean,onCheckChange: (id: number) => void}){ 
return(
    <div className="TimeSchedule">
        {Array.from({ length: 24 }, (_, i) => {
            const getCurrentHour=i.toString().padStart(2, '0');
            const matchedSchedule=addSchedule.filter((todo)=>{
            const addScheduleForHour = todo.startTime.split(":")[0];
           if(getCurrentHour === addScheduleForHour){
               return todo;
           }else{               
            return null;
           }
            });
return (                      
            <div key={i}>
                <span style={{ textAlign: 'left' }} className="flex justify-start text-xl text-slate-500">
                    {getCurrentHour}時
                </span>
                {matchedSchedule.map((todo) => (
                    <div key={todo.id}>
                        <p>📚:{todo.scheduleContent} 🌅開始:{todo.startTime} 🌇終了:{todo.endTime}</p><hr/>
                        {(DeleteCheckFlag === true || editCheckFlag===true) && (
                            <input type="checkbox" onClick={() => {
                                if(editCheckFlag===true){
                                    editSchedule(todo.id);
                                }else{
                                    onCheckChange(todo.id)}
                                
                                }}/>
                        )}
                      
                    </div>
        ))}
              <hr />
            </div>  
            );
        } )}
    </div> 
);
}

export default TimeSchedule;