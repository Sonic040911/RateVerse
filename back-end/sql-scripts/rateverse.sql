CREATE DATABASE `rateverse`;

USE `rateverse`;

CREATE TABLE `user` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,   -- 用户名（唯一）
    email VARCHAR(100) UNIQUE NOT NULL,    -- 邮箱（唯一）
    password_hash VARCHAR(255) NOT NULL,    -- 密码哈希值
    avatar_url VARCHAR(255),                -- 用户头像链接（可选）
    created_at DATETIME DEFAULT NOW(),      -- 注册时间
    updated_at DATETIME DEFAULT NOW()       -- 最后更新时间
);


CREATE TABLE topic (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,             -- 主题标题（如“2023年鼠标评分”）
    description TEXT,                        -- 主题描述（例如“各品牌鼠标型号综合评分”）
    user_id INT NOT NULL,                    -- 创建者ID（外键）
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES USER(id)
);


CREATE TABLE item (
    id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,                   -- 所属主题ID（外键）
    NAME VARCHAR(200) NOT NULL,              -- 评分项名称（如“罗技G502”）
    description TEXT,                        -- 评分项描述（如参数、特性）
    average_rating DECIMAL(3,2) DEFAULT 0,   -- 平均评分（动态计算）
    total_ratings INT DEFAULT 0,             -- 总评分人数
    total_comments INT DEFAULT 0,            -- 总评论数
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (topic_id) REFERENCES topic(id)
);

ALTER TABLE item ADD COLUMN image_url VARCHAR(255) DEFAULT NULL;

CREATE TABLE rating (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                   -- 用户ID（外键）
    item_id INT NOT NULL,                    -- 评分项ID（外键）
    score TINYINT NOT NULL CHECK (score BETWEEN 1 AND 5),
    created_at DATETIME DEFAULT NOW(),
    UNIQUE KEY unique_rating (user_id, item_id), -- 同一用户对同一评分项只能评一次
    FOREIGN KEY (user_id) REFERENCES USER(id),
    FOREIGN KEY (item_id) REFERENCES item(id)
);


CREATE TABLE `comment` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,                   -- 评论用户ID（外键）
    item_id INT NOT NULL,                   -- 所属评分项ID（外键）
    parent_comment_id INT DEFAULT NULL,     -- 父评论ID（用于回复）
    content TEXT NOT NULL,
    likes INT DEFAULT 0,                    -- 点赞总数
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES USER(id),
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (parent_comment_id) REFERENCES COMMENT(id)
);


CREATE TABLE tag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    NAME VARCHAR(50) UNIQUE NOT NULL        -- 标签名称（如“鼠标”）
);

-- 主题与标签的关联表（多对多）
CREATE TABLE topic_tag (
    topic_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (topic_id, tag_id),
    FOREIGN KEY (topic_id) REFERENCES topic(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id)
);



CREATE TABLE draft_topic (
    draft_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '创建者ID',
    title VARCHAR(200) COMMENT '草稿标题',
    description TEXT COMMENT '草稿描述',
    created_at DATETIME DEFAULT NOW() COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES USER(id)
);


CREATE TABLE draft_item (
    draft_item_id INT PRIMARY KEY AUTO_INCREMENT,
    draft_topic_id INT NOT NULL COMMENT '关联的草稿主题ID',
    NAME VARCHAR(200) NOT NULL COMMENT '评分项名称',
    description TEXT COMMENT '评分项描述',
    image_url VARCHAR(255) COMMENT '图片URL',
    created_at DATETIME DEFAULT NOW() COMMENT '创建时间',
    FOREIGN KEY (draft_topic_id) REFERENCES draft_topic(draft_id)
);


USE `rateverse`;

-- 修改 user 表
ALTER TABLE `user` 
    ADD COLUMN google_id VARCHAR(255) NULL,
    MODIFY COLUMN password_hash VARCHAR(255) NULL;
    
ALTER TABLE USER
	ADD COLUMN phone VARCHAR(20) NULL,
	ADD COLUMN address VARCHAR(255) NULL;


-- 修改 topic 表
ALTER TABLE topic 
    ADD COLUMN total_ratings INT DEFAULT 0 COMMENT '总评分人数',
    ADD COLUMN total_comments INT DEFAULT 0 COMMENT '总评论数';

-- 修改 comment 表
ALTER TABLE COMMENT 
    ADD COLUMN dislikes INT DEFAULT 0 COMMENT '点踩数';

-- 创建 comment_like 表
CREATE TABLE comment_like (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    comment_id INT NOT NULL,
    action_type ENUM('like', 'dislike') NOT NULL,
    UNIQUE KEY unique_user_comment_action (user_id, comment_id, action_type)
);

-- 创建 notification 表
CREATE TABLE notification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- 接收通知的用户
    sender_id INT NOT NULL, -- 触发通知的用户
    TYPE ENUM('LIKE', 'COMMENT', 'REPLY', 'RATING') NOT NULL, -- 通知类型
    comment_id INT, -- 相关的评论ID（LIKE/REPLY）
    item_id INT, -- 相关的Item ID（COMMENT）
    message VARCHAR(255) NOT NULL, -- 通知消息
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 通知创建时间
    is_read TINYINT(1) DEFAULT 0, -- 是否已读（0=未读，1=已读）
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES COMMENT(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE
) ENGINE=INNODB;

-- 添加索引
CREATE INDEX idx_notification_user_id ON notification(user_id, created_at);

-- user 表
CREATE UNIQUE INDEX idx_user_username ON USER(username);
CREATE UNIQUE INDEX idx_user_email ON USER(email);

-- topic 表
CREATE INDEX idx_topic_user_id ON topic(user_id);
CREATE INDEX idx_topic_created_at ON topic(created_at);

-- item 表
CREATE INDEX idx_item_topic_id ON item(topic_id);
CREATE INDEX idx_item_created_at ON item(created_at);

-- rating 表
CREATE INDEX idx_rating_user_id ON rating(user_id);
CREATE INDEX idx_rating_item_id ON rating(item_id);

-- comment 表
CREATE INDEX idx_comment_item_id ON COMMENT(item_id);
CREATE INDEX idx_comment_user_id ON COMMENT(user_id);
CREATE INDEX idx_comment_parent_id ON COMMENT(parent_comment_id);
CREATE INDEX idx_comment_created_at ON COMMENT(created_at);

-- comment_like 表
CREATE INDEX idx_comment_like_user_comment ON comment_like(user_id, comment_id);

-- draft 表
CREATE INDEX idx_draft_topic_user_id ON draft_topic(user_id);
CREATE INDEX idx_draft_item_topic_id ON draft_item(draft_topic_id);

-- notification 表补充索引
CREATE INDEX idx_notification_user_unread ON notification(user_id, is_read);



SELECT * FROM item;
SELECT * FROM topic;


