import { useState, useEffect } from 'react'
// import './App.css'
import Clock from './components/Clock';
import Schedule from './components/Schedule';
import ClockAlert from './components/ClockAlert';
import TimeSchedule from './components/TimeSchedule';
import ModalSchedule from './components/ModalSchedule';
import EditSchedule from './components/EditSchedule';
import type { Schedule as ScheduleType } from './types/Schedule';
import { getSchedules, putSchedule, postSchedules, deleteSchedules } from './scheduleAPI';

function App() {



  const [resetInputFlag, setResetInputFlag] = useState<boolean>(false);
  const [DeleteCheckFlag, setDeleteCheckFlag] = useState<boolean>(false);
  const [editCheckFlag, setEditCheckFlag] = useState<boolean>(false);
  const [selectedEditId, setSelectedEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [modalUpdate, setModalUpdate] = useState<boolean>(false);



  const [todoList, setTodoList] = useState<ScheduleType[]>([]);
  const [checkedDeleteList, setCheckedDeleteList] = useState<number[]>([]);



  //リアル時間表示に関する処理
  useEffect(() => {
    const timer = setInterval(() => {
      setModalUpdate(prev => !prev);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  //APIのGETを呼び出す処理
  useEffect(() => {
    async function fetchData() {
      try {
        //sheduleAPIでつくった処理をもってくる
        const schedules = await getSchedules();
        setTodoList(schedules);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);

  const sortTodoList = [...todoList].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  const handleDeleteButton = () => {
    console.log('削除ボタンがクリックされました');
    if (DeleteCheckFlag === true) {
      handleDeleteSchedule();
    } else {
      handleAddDeleteCheck();
    }
  }

  //新規スケジュール追加(post処理)
  const POSTScheduleContent = (data: { scheduleContent: string, startTime: string, endTime: string }) => {

    async function fetchPostData() {

      try {

        const newSchedule = await postSchedules(data);

        setTodoList(prev => [...prev, newSchedule]);
        setResetInputFlag(prevFlag => !prevFlag);
        setIsSubmitting(prevFlag => !prevFlag);
        setSelectedEditId(null);

      } catch (error) {
        console.error('投稿エラー:', error);
      }
    }
    setIsSubmitting(true);
    fetchPostData();

  }

  //削除チェックボックス出現
  const handleAddDeleteCheck = () => {
    if (DeleteCheckFlag === false) {
      alert('対象の削除したいスケジュールのチェックボックスにチェックを入れてください');
    }
    setDeleteCheckFlag(prev => !prev);
    setCheckedDeleteList([]);
    console.log('チェックボックス出現');
  }

  //削除処理(DELETE)
  const handleDeleteSchedule = async () => {

    try {
      //ここでAPIのdelete処理を実行
      await deleteSchedules(checkedDeleteList);

      setTodoList(prevTodoList =>
        prevTodoList.filter(todo =>
          !checkedDeleteList.includes(todo.id)
        )
      );

      setDeleteCheckFlag(false);
      setCheckedDeleteList([]);
      alert('削除が完了しました');

    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました。');

    }
  };

  const handleSelectEditItem = (id: number) => {
    setSelectedEditId(id);
  }

  const handleEditButton = () => {
    setEditCheckFlag(prev => !prev);
    setSelectedEditId(null); // 編集モードを切り替えたら選択をリセット
    setCheckedDeleteList([]); // ついでに削除チェックもリセット
  }

  //スケジュール更新
  const updateSchedule = async (newContent: string,newStartTime: string,newEndTime: string
  ) => {

    if (selectedEditId === null) {
      return;
    }

    try {
      const updatedSchedule = await putSchedule(
        {
          scheduleContent: newContent,
          startTime: newStartTime,
          endTime: newEndTime
        },
        selectedEditId
      );

      setTodoList(prevTodoList =>
        prevTodoList.map(todo =>
          todo.id === updatedSchedule.id ? updatedSchedule : todo
        )
      );

      setSelectedEditId(null);
      setEditCheckFlag(false);

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };


  //選択リスト
  const handleCheckChange = (id: number) => {
    setCheckedDeleteList(prevCheckedList => {
      if (prevCheckedList.includes(id)) {
        return prevCheckedList.filter(checkedId => checkedId !== id);
      } else {
        return [...prevCheckedList, id];
      }
    });
  }

  //モーダルの次回予告関連
  const handleModalSchedule = () => {
    const now = new Date();
    const today = now.toLocaleDateString('ja-JP').replaceAll('/', '-');
    const currentTimeMs = now.getTime();

    const futureSchedules = todoList.filter(todo => {
      const todoStartTime = new Date(`${today} ${todo.startTime}`).getTime();
      const todoEndTime = new Date(`${today} ${todo.endTime}`).getTime();
      return (todoStartTime < currentTimeMs && todoEndTime > currentTimeMs) || todoStartTime > currentTimeMs;
    });

    const sortedFutureSchedules = futureSchedules.sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });

    return {
      closestSchedule: sortedFutureSchedules[0] ?? null,
      nextSchedule: sortedFutureSchedules[1] ?? null,
    };
  }

  const handleCancelButton = () => {
    setDeleteCheckFlag(false);
    setEditCheckFlag(false);
    setSelectedEditId(null);
    setCheckedDeleteList([]);
  }


  return (
    <>
      <div className="grid grid-cols-2">

        <div>
          <TimeSchedule addSchedule={todoList} deleteSchedule={handleDeleteSchedule} DeleteCheckFlag={DeleteCheckFlag} editCheckFlag={editCheckFlag} onCheckChange={handleCheckChange} editSchedule={handleSelectEditItem} />
          <hr />
        </div>

        <div className="grid">
          <div className="border border-black p-4">
            <p>現在時間</p>
            <h1 className="mt-2"><Clock /></h1>
          </div>

          <div className="border border-black p-4">
            <Schedule onChange={POSTScheduleContent} resetInputFlag={resetInputFlag} isSubmitting={isSubmitting} />
          </div>

          {(() => {
            const { closestSchedule, nextSchedule } = handleModalSchedule();
            if (todoList.length === 0 || !closestSchedule) {
              return <p className="text-sm text-slate-500 border border-black p-4">予定がありません</p>;
            }
            // if (!closestSchedule) {
            //   return <p>予定がありません2</p>;
            // }
            return (
              <div className="border border-black">
                <ModalSchedule key={closestSchedule.id} currentTime={new Date().toLocaleTimeString()} startTime={closestSchedule.startTime} endTime={closestSchedule.endTime} scheduleContent={closestSchedule.scheduleContent} closestSchedule={closestSchedule} nextSchedule={nextSchedule} />
              </div>
            );
          })()}


          <div className="border border-black flex flex-col space-y-2">
            <button className="text-white bg-red-500 hover:bg-red-600 rounded-xl" onClick={handleDeleteButton} disabled={editCheckFlag} style={{ background: DeleteCheckFlag ? 'red' : 'orange' }}>{DeleteCheckFlag ? '✓ 削除実行' : '🗑️ 削除モード開始'}</button>
            <button className="text-white bg-green-500 hover:bg-green-600 rounded-xl" onClick={handleEditButton} disabled={DeleteCheckFlag || editCheckFlag} style={{ background: editCheckFlag ? 'gray' : 'green' }}>{editCheckFlag ? '📝 編集実行中' : '🖊️編集モード開始'}</button>
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

