import { Category } from "../../category/Model/category.model";

export interface Blog {
    id: string;
    name: string;
    title: string;
    shortDescription: string;
    content: string;
    featuredImageUrl: string;
    publishedDate: string | Date;
    author: string;
    isVisible: boolean;
    categoryDtos: Category[];
}

export interface CreateBlogRequest {
    name: string;
    title: string;
    shortDescription: string;
    content: string;
    featuredImageUrl: string;
    publishedDate: string | Date;
    author: string;
    isVisible: boolean;
    categories: string[];
}

export interface UpdateBlogRequest {
    name: string;
    title: string;
    shortDescription: string;
    content: string;
    featuredImageUrl: string;
    publishedDate: string | Date;
    author: string;
    isVisible: boolean;
}

