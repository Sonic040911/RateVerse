package com.rateverse.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.rateverse.bean.Item;
import com.rateverse.bean.Topic;
import com.rateverse.mapper.ItemMapper;
import com.rateverse.service.ItemService;
import com.rateverse.utils.PageBean;
import com.rateverse.utils.Result;
import com.rateverse.utils.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Project Name: rate-verse
 *
 * @author: Sonic
 * @description:
 */
@Service
public class ItemServiceImpl implements ItemService {
    @Autowired
    private ItemMapper itemMapper;

    @Override
    public Result getItemsByTopicId(int topicId, int pageSize, int currentPage) {
        PageHelper.startPage(currentPage, pageSize);

        List<Item> items = itemMapper.selectItemsByTopicId(topicId);

        PageInfo<Item> info = new PageInfo<>(items);

        PageBean<Item> pageBean =new PageBean<>(currentPage, pageSize,
                info.getTotal(), info.getList());

        return Result.ok(pageBean, ResultCodeEnum.SUCCESS);
    }

    @Override
    public Result getItemById(int itemId) {
        Item item = itemMapper.selectItemById(itemId);

        if (item == null) {
            return Result.fail(null, ResultCodeEnum.ITEM_DOES_NOT_EXISTS);
        }

        return Result.ok(item, ResultCodeEnum.SUCCESS);
    }
}
