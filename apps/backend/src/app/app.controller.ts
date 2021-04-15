import { Controller, Head } from '@nestjs/common';

@Controller()
export class AppController {

  @Head('/health')
  onHealth(): Promise<void> {
    return Promise.resolve()
  }

}
