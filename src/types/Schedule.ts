//登録済みのスケジュールを管理するもの（React画面で使用）
export interface Schedule {
  id: number;
  scheduleContent: string;
  startTime: string;
  endTime: string;
}

//登録するときの入力データのため、idはつけない（新規登録や更新時に使用する）
export interface ScheduleInput {
  scheduleContent: string;
  startTime: string;
  endTime: string;
}

//バックエンド側からもらったデータをどう扱うかを指定する（Laravelとの通信時にどう扱うかを指定）
export interface ApiSchedule {
  id: number;
  content: string;
  start_time: string;
  end_time: string;
}