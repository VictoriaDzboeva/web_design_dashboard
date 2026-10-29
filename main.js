import { Dashboard } from './js/Dashboard.js';
import { PastMatchesWidget } from './js/widgets/PastMatchesWidget.js';
import { ScheduleWidget } from './js/widgets/ScheduleWidget.js';
import { SquadWidget } from './js/widgets/SquadWidget.js';

const dashboard = new Dashboard();

dashboard.mount(() => new PastMatchesWidget(), 'slot-past');
dashboard.mount(() => new ScheduleWidget(), 'slot-schedule');
dashboard.mount(() => new SquadWidget(), 'slot-squad');