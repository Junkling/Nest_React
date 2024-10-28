import {EventSubscriber, EntitySubscriberInterface, InsertEvent, UpdateEvent} from 'typeorm';
import {BaseTimeEntity} from './base.time.entity';
import {Injectable} from '@nestjs/common';
import {RequestContext} from "nestjs-request-context";

@Injectable()
@EventSubscriber()
export class BaseEntitySubscriber implements EntitySubscriberInterface<BaseTimeEntity> {
    listenTo() {
        return BaseTimeEntity;
    }

    beforeInsert(event: InsertEvent<BaseTimeEntity>) {
        // 생성자 정보 자동 설정
        event.entity.createdBy = this.getCurrentUser();
    }

    beforeUpdate(event: UpdateEvent<BaseTimeEntity>) {
        // 수정자 정보 자동 설정
        if (event.entity) {
            event.entity.updatedBy = this.getCurrentUser();
        }
    }

    private getCurrentUser(): number {
        const request = RequestContext.currentContext.req;
        const user = request.user;
        return user ? user.id : 0;
    }
}
