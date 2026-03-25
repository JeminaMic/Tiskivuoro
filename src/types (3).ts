export interface User {
  id: string;
  name: string;
}

export interface TurnState {
  currentTurnUserId: string;
  users: User[];
  lastUpdated: number;
}
