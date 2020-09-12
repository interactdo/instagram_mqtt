"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SkywalkerSubscriptions {
    static directSub(userId) {
        return `ig/u/v1/${userId}`;
    }
    static liveSub(userId) {
        return `ig/live_notification_subscribe/${userId}`;
    }
}
exports.SkywalkerSubscriptions = SkywalkerSubscriptions;
//# sourceMappingURL=skywalker.subscription.js.map