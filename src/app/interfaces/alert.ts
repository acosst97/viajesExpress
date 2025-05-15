export interface AlertData {
    text: string;
    duration?: number;
    type?: 'success-white' | 'error-white' | 'limits-darkblue';
    position?: any;
}