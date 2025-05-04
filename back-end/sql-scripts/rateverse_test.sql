CREATE DATABASE `rateverse_test`;

USE `rateverse_test`;

CREATE TABLE `user` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,   -- 用户名（唯一）
    email VARCHAR(100) UNIQUE NOT NULL,    -- 邮箱（唯一）
    password_hash VARCHAR(255) NOT NULL,    -- 密码哈希值
    avatar_url VARCHAR(255),                -- 用户头像链接（可选）
    created_at DATETIME DEFAULT NOW(),      -- 注册时间
    updated_at DATETIME DEFAULT NOW()       -- 最后更新时间
);

ALTER TABLE `user` ADD COLUMN google_id VARCHAR(255) NULL;

ALTER TABLE rateverse_test.user MODIFY COLUMN password_hash VARCHAR(255) NULL;


CREATE TABLE topic (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,             -- 主题标题（如“2023年鼠标评分”）
    description TEXT,                        -- 主题描述（例如“各品牌鼠标型号综合评分”）
    user_id INT NOT NULL,                    -- 创建者ID（外键）
    created_at DATETIME DEFAULT NOW(),
    updated_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES USER(id)
);

-- 在 topic 表中添加统计字段，减少实时计算压力：
ALTER TABLE topic 
ADD COLUMN total_ratings INT DEFAULT 0 COMMENT '总评分人数',
ADD COLUMN total_comments INT DEFAULT 0 COMMENT '总评论数';


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


CREATE TABLE comment_like (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    comment_id INT NOT NULL,
    action_type ENUM('like', 'dislike') NOT NULL,
    UNIQUE KEY unique_user_comment_action (user_id, comment_id, action_type)
);


ALTER TABLE COMMENT 
ADD COLUMN dislike INT DEFAULT 0 COMMENT '点踩数';

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
    draft_topic_id INT NOT NULL,
    NAME VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT NOW(),
    FOREIGN KEY (draft_topic_id) REFERENCES draft_topic(draft_id)
);


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




CREATE INDEX idx_notification_user_id ON notification(user_id, created_at);

SELECT * FROM `user`;
SELECT * FROM draft_topic;
SELECT * FROM draft_item;
SELECT * FROM topic;
SELECT * FROM item;
SELECT draft_id FROM draft_topic WHERE user_id = 13


DELETE FROM `draft_topic`;
DELETE FROM `draft_item`;
DELETE FROM `topic` WHERE id = 24;
DELETE FROM `item`;



