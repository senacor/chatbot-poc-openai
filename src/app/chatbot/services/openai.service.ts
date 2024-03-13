import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { setAuthHeaders } from '../../../utils/auth/auth-headers';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  //TODO: Dynamically load the backendUrl instead of hardcoding it
  readonly backendURL = "https://chatbot-backend-csf37hag2a-ey.a.run.app" || "http://localhost:3000";

  constructor(private readonly httpClient: HttpClient) { }
  
  sendMessage(message:Message):Observable<Message> {
    const serviceRequestConfig = setAuthHeaders(this.backendURL, "POST", message);
    return this.httpClient.post<Message>(
      `${this.backendURL}/sendNewPrompt`, {
        message,
      }
    );
  }

  initializeBot():Observable<Message> {
    const serviceRequestConfig = setAuthHeaders(this.backendURL, "GET");
    return this.httpClient.get<Message>(
      `${this.backendURL}/initBot`
    )
  }
}