

export interface Section {
    sectionId: string;
    sectionName: string;
    orderNumber: number;
    courseMaterials: Material[];
    duration: number;
}

export interface Course {
    id: string;
    name: string;
    code: string;
    description: string;
    imageUrl: string;
    price: number;
    discount: number;
    durationWeeks: number;
    language: string;
    level: string;
    published: boolean;
    datePublished: string;
    creator: User;
    instructor: User;
    prerequisites: string[];
    discountedPrice: number;
    tags: Tags[];
    sections?: Section[] | undefined;
}
export interface Material {
    id: string;
    materialUid: string;
    category: "ASSIGNMENT" | "LAB" | "LECTURE" | "REFERENCE" | "ASSESSMENT";
    name: string;
    orderNum: number;
    title: string;
    expectedDuration: number;
    contentType: "VIDEO" | "IMAGE" | "TEXT" | "AUDIO" | "DOCUMENT";
    content: string;
    published: boolean;
}

// Định nghĩa kiểu dữ liệu cho người dùng
export interface User {
    id: string,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    studentCode: string,
    is2faEnabled: boolean,
    roleId: string,
    roleName: string,
    createdAt: Date,
    locked: boolean,
    name: string
}

// Tạo Context để lưu trữ token và dữ liệu người dùng
export interface AuthContextType {
    token: string | null;
    user: User | null;
    loading: boolean;
    setAuth: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    url: string;
}

export interface AnimationStatusProps {
    status: 'loading' | 'success' | 'error' | null;
    text?: string;
    onDone?: () => void;
    show?: boolean;
}


export interface Enrollment {
    _id: string;
    user: string; // userId
    course: string; // courseId
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
    grade: number;
    statusHistory: {
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
        createdAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
}
export interface Tags {
    id: string;
    name: string;
    topic: string;
    createdBy: string;
}

