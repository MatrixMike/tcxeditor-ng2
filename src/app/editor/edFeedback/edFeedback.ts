import {Component, Input, Output, EventEmitter} from '@angular/core';

export interface Comment {
    email: string;
    comment: string;
    date: string;
}

@Component({
  selector: 'app-feedback-widget',
  templateUrl: './edFeedback.html',
  styleUrls: ['./edFeedback.scss']
})
export class FeedbackWidgetComponent {
    @Input() comments = [];
    @Output() newComment = new EventEmitter();
    email: string;
    comment: string;

    addComment(c, e) {
        this.newComment.next({
            comment: c,
            email: e
        });
    }
}
