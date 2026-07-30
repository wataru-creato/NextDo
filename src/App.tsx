import { useState,useEffect} from 'react'
// import './App.css'
import Clock from './components/Clock';
import Schedule from './components/Schedule';
import ClockAlert from './components/ClockAlert';
import TimeSchedule from './components/TimeSchedule';
import ModalSchedule from './components/ModalSchedule';
import EditSchedule from './components/EditSchedule';



function App() {

  

  const [resetInputFlag,setResetInputFlag]=useState<boolean>(false);
  const [DeleteCheckFlag, setDeleteCheckFlag] = useState<boolean>(false);
  const [editCheckFlag, setEditCheckFlag] = useState<boolean>(false);
  const [selectedEditId,setSelectedEditId]=useState<number| null>(null);
  const [isSubmitting,setIsSubmitting]=useState<boolean>(false);
  
  const [modalUpdate,setModalUpdate]=useState<boolean>(false);



  const[todoList,setTodoList]=useState<{id:number,scheduleContent: string, startTime: string, endTime: string}[]>([]);
  const[checkedDeleteList,setCheckedDeleteList]=useState<number[]>([]);


  
  
  useEffect(() => { 
    const timer = setInterval(() => {
      setModalUpdate(prev => !prev);  
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(()=>{
        async function fetchData() {
            try {
              const response = await fetch('http://localhost:80/api/schedules');
              const data=await response.json();
              const formattedData = data.map((item: { id:number; content: string; start_time: string; end_time: string; }) => {
                return { id: item.id, scheduleContent: item.content, startTime: item.start_time, endTime: item.end_time };
              });
              setTodoList(formattedData);

            } catch (error) {
              console.error('Error fetching data:', error);
            }
    };
    
    fetchData();

  },[]);

const sortTodoList=[...todoList].sort((a,b)=>{
  return a.startTime.localeCompare(b.startTime);
});

const handleDeleteButton=()=>{
  console.log('削除ボタンがクリックされました');
  if(DeleteCheckFlag === true){
    handleDeleteSchedule();
  }else{
    handleAddDeleteCheck();
  }
}

//新規スケジュール追加
const GetScheduleContent=(data:{scheduleContent:string,startTime:string,endTime:string})=>{

  async function fetchPostData() {

    try {
          
              const response = await fetch(`http://localhost:80/api/schedules`,{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',  
                          },
                    body: JSON.stringify({                 
                        scheduleContent: data.scheduleContent,
                        startTime: data.startTime,
                        endTime: data.endTime,
                        }),
              });
               if(response.ok){
                console.log('投稿成功');
                const newSchedule = await response.json();
                setTodoList([...todoList, { 
                  id: newSchedule.id, 
                  scheduleContent: newSchedule.content, 
                  startTime: newSchedule.start_time, 
                  endTime: newSchedule.end_time }]);
                setResetInputFlag(prevFlag => !prevFlag);
                setIsSubmitting(prevFlag => !prevFlag);
                setSelectedEditId(null);
               }
              
                
          
            } catch (error) {
              console.error('投稿エラー:', error);
            }
  }
  setIsSubmitting(true);
  fetchPostData();
  
  
}


//削除チェックボックス出現
const handleAddDeleteCheck=()=>{
  if(DeleteCheckFlag === false){
    alert('対象の削除したいスケジュールのチェックボックスにチェックを入れてください');
  }
  setDeleteCheckFlag(prev=>!prev);
  setCheckedDeleteList([]);
  console.log('チェックボックス出現');
}

//削除処理
const handleDeleteSchedule=()=>{
    console.log('削除処理モード');
    console.log('現在のtodoList:',todoList);
    const previousTodoList=[...todoList];//現在状態のバックアップ用

    setTodoList(prevTodoList => prevTodoList.filter(todo => !checkedDeleteList.includes(todo.id)));
    setDeleteCheckFlag(false);

    async function fetchDeleteData() {
            try {
              const deletePromises = checkedDeleteList.map(id =>
              fetch(`http://localhost:80/api/schedules/${id}`,{
                method: 'DELETE',

              }));
              const responses = await Promise.all(deletePromises);
              const hasError = responses.some(response => !response.ok);
               if(hasError){
                console.error('削除失敗',checkedDeleteList);
                alert('削除に失敗しました。');
               }
              
                setTodoList(prevTodoList => prevTodoList.filter(todo => {
                  return !checkedDeleteList.includes(todo.id);
                }));
                  setDeleteCheckFlag(false);
                  setCheckedDeleteList([]);
                  alert('削除が完了しました');
          
            } catch (error) {
              console.error('Error fetching data:', error);
              alert('削除に失敗したため、削除前の状態に戻します。');
              setTodoList(previousTodoList);
            }
    };

    if(checkedDeleteList.length===0){
                alert('最低一つはチェックしてください');
                return;
               }

    fetchDeleteData();
    
  // setTodoList([]);
  // console.log(todoList);
  
}

const handleSelectEditItem=(id:number)=>{
  setSelectedEditId(id);
}

const handleEditButton=()=>{
  setEditCheckFlag(prev=>!prev);
  setSelectedEditId(null); // 編集モードを切り替えたら選択をリセット
  setCheckedDeleteList([]); // ついでに削除チェックもリセット
}

//スケジュール更新
const updateSchedule=(newContent:string, newStartTime:string, newEndTime:string)=>{
const previousTodoList=[...todoList];//現在状態のバックアップ用
setTodoList(todoList.map(todo => 
      todo.id === selectedEditId ? { ...todo, scheduleContent: newContent, startTime: newStartTime, endTime: newEndTime } : todo
      ));
setSelectedEditId(null);
setEditCheckFlag(false);

  async function fetchUpdateData() {
    try{
      const response=await fetch(`http://localhost:80/api/schedules/${selectedEditId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          scheduleContent: newContent,
          startTime: newStartTime,
          endTime: newEndTime,
        }),
      
      });
      
      if(response.ok){
        console.error('更新失敗');
        alert('更新に失敗しました。');
      }

      alert('更新が完了しました');
    }catch (error) {
      console.error('Error updating data:', error);
       setTodoList(previousTodoList);
    }
  }
  
  fetchUpdateData();
}


//選択リスト
const handleCheckChange=(id: number)=>{
  setCheckedDeleteList(prevCheckedList => {
    if (prevCheckedList.includes(id)) {
    return prevCheckedList.filter(checkedId => checkedId !== id);
    } else {
      return [...prevCheckedList, id];
    }
  });
}

//モーダルの次回予告関連
 const handleModalSchedule=()=>{
      const now = new Date();
      const today = now.toLocaleDateString('ja-JP').replaceAll('/', '-');
      const currentTimeMs = now.getTime();

      const futureSchedules=todoList.filter(todo=>{
        const todoStartTime=new Date(`${today} ${todo.startTime}`).getTime();
        const todoEndTime=new Date(`${today} ${todo.endTime}`).getTime();
        return (todoStartTime < currentTimeMs && todoEndTime > currentTimeMs) || todoStartTime > currentTimeMs;
      });

      const sortedFutureSchedules=futureSchedules.sort((a,b)=>{
        return a.startTime.localeCompare(b.startTime);
      });

      return {
        closestSchedule: sortedFutureSchedules[0] ?? null,
        nextSchedule: sortedFutureSchedules[1] ?? null,
      };
}

const handleCancelButton=()=>{
  setDeleteCheckFlag(false);
  setEditCheckFlag(false);
  setSelectedEditId(null);
  setCheckedDeleteList([]);
}



  return (
    <>
    <div className="grid grid-cols-2">

      <div>
      <TimeSchedule addSchedule={todoList} deleteSchedule={handleDeleteSchedule}  DeleteCheckFlag={DeleteCheckFlag} editCheckFlag={editCheckFlag} onCheckChange={handleCheckChange} editSchedule={handleSelectEditItem} />
      <hr/>
      </div>

      <div className="grid">
        <div className="border border-black p-4">
          <p>現在時間</p>
          <h1 className="mt-2"><Clock /></h1>
        </div>

        <div className="border border-black p-4">
          <Schedule onChange={GetScheduleContent} resetInputFlag={resetInputFlag} isSubmitting={isSubmitting}/>
        </div>

        {(() => {
          const {closestSchedule, nextSchedule} = handleModalSchedule();
          if (todoList.length === 0 || !closestSchedule) {
            return <p className="text-sm text-slate-500 border border-black p-4">予定がありません</p>;
          }
          // if (!closestSchedule) {
          //   return <p>予定がありません2</p>;
          // }
          return (
            <div className="border border-black">
              <ModalSchedule key={closestSchedule.id} currentTime={new Date().toLocaleTimeString()} startTime={closestSchedule.startTime} endTime={closestSchedule.endTime} scheduleContent={closestSchedule.scheduleContent} closestSchedule={closestSchedule} nextSchedule={nextSchedule}/>
            </div>
          );
        })()}

       
        <div className="border border-black flex flex-col space-y-2">
          <button className="text-white bg-red-500 hover:bg-red-600 rounded-xl" onClick={handleDeleteButton} disabled={editCheckFlag} style={{background: DeleteCheckFlag ? 'red' : 'orange'}}>{DeleteCheckFlag ? '✓ 削除実行' : '🗑️ 削除モード開始'}</button>
          <button className="text-white bg-green-500 hover:bg-green-600 rounded-xl" onClick={handleEditButton} disabled={DeleteCheckFlag || editCheckFlag} style={{background: editCheckFlag ? 'gray' : 'green'}}>{editCheckFlag ? '📝 編集実行中' : '🖊️編集モード開始'}</button>
          <button className="text-white bg-gray-500 hover:bg-gray-600 rounded-xl" disabled={!DeleteCheckFlag && !editCheckFlag} onClick={handleCancelButton}>✖キャンセル</button>
        </div>
         {selectedEditId !== null && (
          <div className="border border-black p-4">
            <EditSchedule targetTodo={todoList.find(todo => todo.id === selectedEditId)} onSave={updateSchedule} />
          </div>
        )}


         {sortTodoList.map((todo) => (
            <div key={todo.id}>
              <ClockAlert currentTime={new Date().toLocaleTimeString()} startTime={todo.startTime} endTime={todo.endTime} scheduleContent={todo.scheduleContent} />
            </div>
          ))}
      </div>
      </div>
      
    </>
  )
}

export default App

