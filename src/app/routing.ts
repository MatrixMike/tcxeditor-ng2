import { RouterModule }   from '@angular/router';

import { UploadComponent } from './upload/upload.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { EditorComponent } from './editor/editor.component';

export const Routes = [
      { path: 'upload', component: UploadComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'editor', component: EditorComponent },

      { path: '**', component: UploadComponent }
    ]