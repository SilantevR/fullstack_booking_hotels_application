import { UpdateRoomDto } from './dto/update-room.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  UseInterceptors,
  UploadedFiles,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { HotelsService } from './hotels.service';
import { RoomsService } from './rooms.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import { CreateRoomDto } from './dto/create-room.dto';
import fileName from 'src/static.file.name';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Auth } from '../auth/decorator/auth.decorator';
import { AuthType } from '../auth/enums/auth-type.enum';
import { ActiveUser } from '../auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/interfaces';
import * as fs from 'fs';
import { DeleteHotelImageDto } from './dto/delete-hotel-image.dto';
import { DeleteRoomImageDto } from './dto/delete-room-image.dto';
@Controller('api')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly roomsService: RoomsService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @Post('/admin/hotels/')
  create(@Body(new ValidationPipe()) createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }

  @Roles(Role.Admin)
  @Get('/admin/hotels/')
  find(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.hotelsService.search({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Roles(Role.Admin)
  @Get('/admin/hotels/:id')
  findHotelById(@Param('id') id: Types.ObjectId) {
    return this.hotelsService.findById(id);
  }

  @Roles(Role.Admin)
  @Put('/admin/hotels/:id')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: 'public/hotels-image',
        filename: fileName,
      }),
    }),
  )
  update(
    @Param('id') id: Types.ObjectId,
    @Body(new ValidationPipe()) updateHotelDto: UpdateHotelDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10485760 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    const images = [];
    const oldImages = JSON.parse(updateHotelDto.images) ?? [];
    Array.isArray(oldImages)
      ? oldImages.map((file) => images.push(file))
      : images.push(oldImages);
    files.map((file) => images.push(file.path));
    return this.hotelsService.update(id, { ...updateHotelDto, images: images });
  }

  @Roles(Role.Admin)
  @Delete('/admin/hotels/images/:id')
  async deleteImage(
    @Body(new ValidationPipe()) deleteImageDto: DeleteHotelImageDto,
    @Param('id') id: Types.ObjectId,
  ) {
    fs.unlink(deleteImageDto.src, (err) => {
      if (err) {
        throw new InternalServerErrorException(err);
      }
    });
    return this.hotelsService.update(id, deleteImageDto.hotel);
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @Post('/admin/hotel-rooms/')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: 'public/rooms-image',
        filename: fileName,
      }),
    }),
  )
  async createRoom(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10485760 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Array<Express.Multer.File>,
    @Body(new ValidationPipe()) createRoomDto: CreateRoomDto,
  ) {
    const images = files.map((file) => file.path);
    const isEnabled = true;

    return await this.roomsService.create({
      ...createRoomDto,
      images,
      isEnabled,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  @Auth(AuthType.None)
  @Get('/common/hotel-rooms')
  search(
    @ActiveUser('role') role: ActiveUserData['role'],
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('hotel') hotel?: string,
    @Query('title') title?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    let isEnabled = false;

    if (!role || role === 'client') {
      isEnabled = true;
    }

    return this.roomsService.search({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
      hotel: hotel,
      title: title,
      isEnabled,
      startDate,
      endDate,
    });
  }

  @Auth(AuthType.None)
  @Get('/common/hotel-rooms/:id')
  findById(@Param('id') id: Types.ObjectId) {
    return this.roomsService.findById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @Put('/admin/hotel-rooms/:id')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: 'public/rooms-image',
        filename: fileName,
      }),
    }),
  )
  async editRoom(
    @Param('id') id: Types.ObjectId,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10485760 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Array<Express.Multer.File>,
    @Body(new ValidationPipe()) updateRoomDto: UpdateRoomDto,
  ) {
    const images = [];
    const oldImages = JSON.parse(updateRoomDto.images);
    Array.isArray(oldImages)
      ? oldImages.map((file) => images.push(file))
      : images.push(oldImages);
    files.map((file) => images.push(file.path));

    return await this.roomsService.update(id, {
      ...updateRoomDto,
      images: images,
      updatedAt: new Date(),
    });
  }

  @Roles(Role.Admin)
  @Delete('/admin/hotel-rooms/images/:id')
  async deleteRoomImage(
    @Body(new ValidationPipe()) deleteImageDto: DeleteRoomImageDto,
    @Param('id') id: Types.ObjectId,
  ) {
    fs.unlink(deleteImageDto.src, (err) => {
      if (err) {
        throw new InternalServerErrorException(err);
      }
    });
    return this.roomsService.update(id, {
      ...deleteImageDto.room,
      updatedAt: new Date(),
    });
  }
}
