require('./../utils/jquery-slidefade');

var $ = window.jQuery = require('jquery');

require('jquery-ui/ui/core');
require('jquery-ui/ui/widget');
require('jquery-ui/ui/mouse');
require('jquery-ui/ui/draggable');
require('jquery-ui/ui/droppable');
require('jquery-ui/ui/sortable');
require('jquery-ui/ui/resizable');
require('jquery-ui/ui/button');
require('jquery-ui/ui/dialog');

var initDashboard = function() {
    var updateDashboardModules = function () {
        var $form = $('#update-dashboard-modules-form');
        var modules = [];

        $('.dashboard-column').each(function () {
            var $column = $(this);
            var column = $column.closest('.dashboard-column-wrapper').index();

            $column.find('.dashboard-item').each(function () {
                var $item = $(this);
                var order = $item.index();
                var id = $item.data('module-id');

                modules.push({
                    id: id,
                    column: column,
                    order: order
                });
            });
        });

        $form.find('[name="modules"]').val(JSON.stringify(modules));

        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method'),
            dataType: 'json',
            data: $form.serialize()
        });
    };

    $('.dashboard-column').droppable({
        activeClass: 'active',
        hoverClass: 'hovered',
        tolerance: 'pointer',
        accept: '.dashboard-item'
    }).sortable({
        items: '.dashboard-item',
        handle: '.dashboard-item-header',
        tolerance: 'pointer',
        connectWith: '.dashboard-column',
        cursor: 'move',
        placeholder: 'dashboard-item placeholder',
        forcePlaceholderSize: true,
        update: function (event, ui) {
            updateDashboardModules();
        }
    });

    $('.dashboard-item.collapsible').each(function () {
        var $item = $(this);
        var $link = $item.find('.dashboard-item-collapse');
        var $collapsible = $item.find('.dashboard-item-content');
        var $form = $('#update-dashboard-module-collapse-form');
        var moduleId = $item.data('module-id');

        $link.on('click', function (e) {
            e.preventDefault();

            $collapsible.slideFadeToggle(200, 'swing', function () {
                var collapsed = $collapsible.is(':visible') == false;

                if (collapsed) {
                    $item.addClass('collapsed')
                } else {
                    $item.removeClass('collapsed')
                }

                $form.find('[name="id"]').val(moduleId);
                $form.find('[name="collapsed"]').val(collapsed ? 'true' : 'false');

                $.ajax({
                    url: $form.attr('action'),
                    method: $form.attr('method'),
                    dataType: 'json',
                    data: $form.serialize()
                });
            });
        });
    });

    $('.dashboard-item.deletable').each(function () {
        var $item = $(this);
        var $link = $item.find('.dashboard-item-remove');
        var $form = $('#remove-dashboard-module-form');
        var moduleId = $item.data('module-id');

        $link.on('click', function (e) {
            e.preventDefault();

            var buttons = {};

            var deleteModule = function () {
                $item.fadeOut(200, 'swing', function () {
                    $form.find('[name="id"]').val(moduleId);

                    $.ajax({
                        url: $form.attr('action'),
                        method: $form.attr('method'),
                        dataType: 'json',
                        data: $form.serialize()
                    });
                });
            };

            buttons[django.gettext('Delete')] = function () {
                deleteModule();
                $(this).dialog('close');
            };

            buttons[django.gettext('Cancel')] = function () {
                $(this).dialog('close');
            };

            $('#module-remove-dialog').dialog({
                resizable: false,
                modal: true,
                buttons: buttons
            });
        });
    });

    $('.dashboard-tools-toggle').on('click', function() {
        $('.dashboard-tools').toggleClass('visible');
    });

    var $form = $('#add-dashboard-module-form');

    $form.find('.add-dashboard-link').on('click', function (e) {
        var $typeInput = $form.find('[name="type"]');
        var type = $form.find('[name="module"] option:selected').data('type');

        if (type) {
            $typeInput.val(type);

            $.ajax({
                url: $form.attr('action'),
                method: $form.attr('method'),
                dataType: 'json',
                data: $form.serialize(),
                success: function (result) {
                    if (result.error) {
                        return;
                    }

                    document.location = result.success_url;
                }
            });
        }

        e.preventDefault();
    });

    $('.dashboard-item.ajax').each(function () {
        var $item = $(this);
        var $content = $item.find('.dashboard-item-content');
        var url = $item.data('ajax-url');
        var moduleId = $item.data('module-id');

        $form.find('[name="id"]').val(moduleId);

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (result) {
                if (result.error) {
                    $content.empty();
                    return;
                }

                var oldHeight = $content.height();
                $content.html(result.html);
                var newHeight = $content.height();

                $content.height(oldHeight);
                $content.animate({
                    height: newHeight
                }, 250);
            },
            error: function() {
                $content.empty();
            }
        });
    });

    $('.reset-dashboard-link').on('click', function(e) {
        var buttons = {};
        var resetDashboard = function () {
            var $form = $('#reset-dashboard-form');

            $.ajax({
                url: $form.attr('action'),
                method: $form.attr('method'),
                dataType: 'json',
                data: $form.serialize(),
                success: function (result) {
                    if (result.error) {
                        return;
                    }

                    location.reload();
                }
            });
        };

        buttons[django.gettext('Yes')] = function() {
            resetDashboard();
            $(this).dialog('close');
        };

        buttons[django.gettext('Cancel')] = function() {
            $(this).dialog('close');
        };

        $('#reset-dashboard-dialog').dialog({
            resizable: false,
            modal: true,
            buttons: buttons
        });

        e.preventDefault();
    });
};

$(document).ready(function() {
    initDashboard();
});
