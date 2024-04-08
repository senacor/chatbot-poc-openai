import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnChanges, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from '../../models/message';
import { MessageCardComponent } from '../../ui/message-card/message-card.component';
import { CommonModule } from "@angular/common";
import { InputFieldComponent } from '../../ui/input-field/input-field.component';
import { OpenaiService } from '../../services/openai.service';
import { take  } from 'rxjs';
import { VisibleMessagesPipe } from "../../pipes/visible-messages.pipe";
import { MessageLoaderComponent } from 'app/chatbot/ui/message-loader/message-loader.component';

@Component({
    selector: 'app-chatbox',
    standalone: true,
    templateUrl: './chatbox.component.html',
    styleUrl: './chatbox.component.scss',
    imports: [
        MessageCardComponent,
        InputFieldComponent,
        CommonModule,
        VisibleMessagesPipe,
        MessageLoaderComponent,
    ]
})
export class ChatboxComponent implements AfterViewInit	 {
  @ViewChild('chatbox', { static: true })
  chatBox!: ElementRef;

  messages: Message[] = [];

  isLoading: boolean = false;

  constructor(private readonly openaiService: OpenaiService){
  }

  ngOnInit() {
    this.isLoading = true;
    this.openaiService.initializeBot().pipe(take(1)).subscribe({
      next: messages => {
        this.messages = messages;
        this.isLoading = false;
      },
      error: error => {
        console.error(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  ngAfterViewInit(): void {
  }

  sendNewMessage(input:string){
    this.isLoading = true;
    const message = {
      content: input,
      role: "user"
    };
    this.messages.push(message);
    this.openaiService.sendMessage(this.messages)
    .pipe(take(1))
    .subscribe({
      next: response => {
        this.messages.push(response);
        this.isLoading = false;
      },
      error: error => {
        console.error(error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
