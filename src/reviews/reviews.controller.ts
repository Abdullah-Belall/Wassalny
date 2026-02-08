import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Get,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/decorators/user.decorator';
import type { UserTokenInterface } from 'src/users/types/interfaces/user-token.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':travel_id')
  @UseGuards(AuthGuard)
  async readReviews(
    @User() { id: user_id }: UserTokenInterface,
    @Param('travel_id', new ParseUUIDPipe()) travel_id: string
  ) {
    return await this.reviewsService.readReviews(user_id, travel_id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() { id: user_id }: UserTokenInterface,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return await this.reviewsService.create(user_id, createReviewDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @User() { id: user_id }: UserTokenInterface,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewsService.update(user_id, id, updateReviewDto);
  }
}
