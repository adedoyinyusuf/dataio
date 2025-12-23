'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHospitalUser,
    faBaby,
    faNotesMedical,
    faChartBar,
    faUserDoctor,
    faSyringe,
    faPersonPregnant,
    faHandsHoldingChild,
    faVirus,
    faMosquito,
    faWheelchair,
    faVenus,
    faMars
} from '@fortawesome/free-solid-svg-icons';

const iconMap: Record<string, any> = {
    'fa-hospital-user': faHospitalUser,
    'fa-baby': faBaby,
    'fa-notes-medical': faNotesMedical,
    'fa-chart-bar': faChartBar,
    'fa-user-doctor': faUserDoctor,
    'fa-syringe': faSyringe,
    'fa-person-pregnant': faPersonPregnant,
    'fa-hands-holding-child': faHandsHoldingChild,
    'fa-virus': faVirus,
    'fa-mosquito': faMosquito,
    'fa-wheelchair': faWheelchair,
    'fa-venus': faVenus,
    'fa-mars': faMars
};

interface DynamicIconProps {
    iconName?: string;
    className?: string;
    fallback?: any;
}

export default function DynamicIcon({ iconName, className, fallback = faChartBar }: DynamicIconProps) {
    // Normalize: remove 'fa-solid ' prefix if present
    const key = iconName?.replace('fa-solid ', '').replace('fas ', '') || '';
    const icon = iconMap[key] || fallback;

    return <FontAwesomeIcon icon={icon} className={className} />;
}
