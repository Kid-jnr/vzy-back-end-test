import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Headers,
  Req
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorHelper, HttpResponse } from 'src/utils';
import { AuthGuard } from 'src/guards/auth.guard';
import { IUser, User } from 'src/decorators';
import { RequestWithRawBody } from 'src/interfaces/request-with-raw-body.interface';


@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: IUser) {
    if (user.id !== id) {
      ErrorHelper.BadRequestException(`Bad request`);
    }
    const userData = await this.userService.findOne(user.id);

    return HttpResponse.success({
      data: userData,
      message: 'User record retrieved successfully',
    });
  }

  @UseGuards(AuthGuard)
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser
  ) {
    
    const data = await this.userService.update(user.id, updateUserDto);
    return HttpResponse.success({
      data: data,
      message: 'User updated successfully',
    });
  }


  @Post('stripe-webhook')
  async webHookListen(@Headers('stripe-signature') signature: string, @Req() req :RequestWithRawBody) {
     const data = await this.userService.webHookListen(req.rawBody,signature)
    if (data.paymentStatus == "paid") {

      const user = await this.userService.update(data.customerId,{paymentStatus: "paid"});
      return HttpResponse.success({
        data: user,
        message: 'User payment status updated successfully',
      });
    }
  }
}
