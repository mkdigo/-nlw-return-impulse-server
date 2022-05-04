import { MailAdapter } from '../adapters/mail-adapter';
import { FeedbacksRepository } from '../repositories/feedbacks-repository';

interface SubmitFeedbackUseCaseRequest {
  type: string;
  comment: string;
  screenshot?: string;
}

export class SubmitFeedbackUseCase {
  constructor(
    private feedbacksRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter
  ) {}

  async execute(request: SubmitFeedbackUseCaseRequest) {
    await this.feedbacksRepository.create(request);

    await this.mailAdapter.sendMail({
      subject: 'Novo Feedback',
      body: [
        `<div style='font-family: sans-serif; font-size: 16px; color: #111;'>`,
        `<p>Tipo do feedback: ${request.type}</p>`,
        `<p>Comentário: ${request.comment}</p>`,
        `</div>`,
      ].join('\n'),
    });
  }
}
