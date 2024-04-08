import { Article } from '../repo/article.js';
import ArticleDb from '../repo/articleDb.js';
import ArticleStorage from '../repo/articleStorage.js';
import { ServiceRestError } from './ServiceRestError.js';


export default class ArticleDeleteService {
    private articleDb: ArticleDb = ArticleDb.getInstance();
    private articleStorage: ArticleStorage = ArticleStorage.getInstance();
    private articleId: Article["ArticleID"];
    private article: Article | undefined;

    constructor(articleId: number){
        this.articleId = articleId;
    }

    private async checkArticleExist() {
        const articleCount = await this.articleDb.countArticleByArticleId(this.articleId);
        const isArticleExist = articleCount > 0;

        if (!isArticleExist) {
            throw new ServiceRestError("Article not found", 404);
        }
    }

    private async loadArticleFromDb() {
        const article = await this.articleDb.getArticleById(this.articleId);
        this.article = article!;
    }

    private async deactivateArticleInDb() {
        this.article!.Active = false;
        await this.articleDb.updateArticle(this.articleId, this.article!);
    }

    private async deleteArticleInStorage() {
        await this.articleStorage.deleteArticle(this.article?.StorageArticleUUID!);
    }
    public async delete() {
        await this.checkArticleExist();
        await this.loadArticleFromDb();
        await this.deactivateArticleInDb();
        await this.deleteArticleInStorage();
    }
}