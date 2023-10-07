export interface MessageData {
  text: string;
}

export interface ReadMessageData {
  createdBefore: Date;
}

export interface fetchSupportRequestData {
  _id: string;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
}
export interface fetchMessageData {
  _id: string;
  createdAt: string;
  text: string;
  readAt: string;
  author: {
    _id: string;
    name: string;
  };
}

export interface fetchSupportRequestsResult {
  count: number;
  result: fetchSupportRequestData[];
}

export interface SupportRequestItemParams {
  supportRequest: fetchSupportRequestData;
}

export interface MessageItemParams {
  message: fetchMessageData;
}
