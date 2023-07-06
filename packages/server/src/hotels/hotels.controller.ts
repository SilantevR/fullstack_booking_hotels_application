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

@Controller('api')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post('/admin/hotels/')
  create(@Body(new ValidationPipe()) createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }

  @Get('/admin/hotels/')
  find(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.hotelsService.search({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Put('/admin/hotels/:id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body(new ValidationPipe()) updateHotelDto: UpdateHotelDto,
  ) {
    return this.hotelsService.update(id, updateHotelDto);
  }

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
          new MaxFileSizeValidator({ maxSize: 20000000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Body(new ValidationPipe()) createRoomDto: CreateRoomDto,
  ) {
    //console.log(files);
    const images = files.map((file) => file.path);
    const isEnabled = true;
    const hotel = await this.hotelsService.findById(createRoomDto.hotelId);
    return await this.roomsService.create({
      ...createRoomDto,
      hotel,
      images,
      isEnabled,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  @Get('/common/hotel-rooms')
  search(
    @Query('hotel') hotel?: Types.ObjectId,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const isEnabled = true;
    return this.roomsService.search({
      limit: limit ? Number(limit) : 10,
      offset: offset ? Number(offset) : 0,
      hotel,
      isEnabled,
    });
  }

  @Get('/common/hotel-rooms/:id')
  findById(@Param('id') id: Types.ObjectId) {
    return this.roomsService.findById(id);
  }

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
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(new ValidationPipe()) updateRoomDto: UpdateRoomDto,
  ) {
    //const isEnabled = true;
    const images = [];
    const oldImages = updateRoomDto.images;
    Array.isArray(oldImages)
      ? oldImages.map((file) => images.push(file))
      : images.push(oldImages);
    files.map((file) => images.push(file.path));
    return await this.roomsService.update(id, {
      ...updateRoomDto,
      updatedAt: new Date(),
    });
  }
}
