/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decoretor';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';
import { filter } from 'rxjs';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) { }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user)
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string, @GetUser() user: User): void {
        return this.tasksService.deleteTaskById(id, user)
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string, 
        @Body() updateTaskStatus: UpdateTaskStatusDto,
        @GetUser() user: User,
    ): Promise<Task> {
        const { status } = updateTaskStatus;
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    @Get()
    getAllTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose('Uporabnik ' + user.username + ' kliče vse taske. Filtri: ' + JSON.stringify(filterDto));
        return this.tasksService.getTasks(filterDto, user);
    }

    @Post()
    createTask(
        @GetUser() user: User,
        @Body() createTaskDto: CreateTaskDto
    ): Promise<Task> {
        this.logger.verbose('Uporabnik ' + user.username + ' ustvarja nov task. Podatki: ' + JSON.stringify(createTaskDto));
        return this.tasksService.createTask(createTaskDto, user);
    }
}
