import { Router } from 'express';
import * as articleController from './controller/articleController.js';
import { articleIdValidator, articleQueryValidator } from './middleware/validator/article.js';

import ArticleFileValidator from './middleware/validator/articleFile.js';
import { handleExpressValidation } from './middleware/validator/expressValidatorHandler.js';
import UserExtractor from './middleware/userExtractor.js';
import CheckUserArticleAccess from './middleware/userArticleAccess.js';

const router = Router();
const ARTICLE_API_ENDPOINT = 'article';

router.use(new UserExtractor()._);

router.post(`/:accountId/${ARTICLE_API_ENDPOINT}`, 
    new ArticleFileValidator()._,
    articleController.createArticle
);


router.get(`/:accountId/${ARTICLE_API_ENDPOINT}`, articleQueryValidator, articleController.listArticle);

router.get(`/:accountId/${ARTICLE_API_ENDPOINT}/:articleId`,
            articleIdValidator,
            new CheckUserArticleAccess().checkAccessMiddleware,
            handleExpressValidation,  
            articleController.getArticle);

router.get('/:accountId/article/:articleId/metadata', 
                                articleIdValidator, 
                                new CheckUserArticleAccess().checkAccessMiddleware,
                                handleExpressValidation,
                                articleController.getArticleMetadata);

router.delete(`/:accountId/${ARTICLE_API_ENDPOINT}/:articleId`, 
                articleIdValidator,
                new CheckUserArticleAccess().checkAccessMiddleware,
                handleExpressValidation,
                articleController.deleteArticle);

export default router;