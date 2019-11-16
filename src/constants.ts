import { RegionHintParser } from './realtime/parsers/region-hint.parser';
import { GraphqlParser } from './realtime/parsers/graphql.parser';
import { IrisParser } from './realtime/parsers/iris.parser';
import { JsonParser } from './realtime/parsers/json.parser';
import { SkywalkerParser } from './realtime/parsers/skywalker.parser';
import { Topic } from './topic';

export const Topics: { [x: string]: Topic } = {
    PP: {
        id: '34',
        path: '/pp',
        parser: new JsonParser(),
    },
    GRAPHQL: {
        id: '9',
        path: '/graphql',
        parser: new GraphqlParser(),
    },
    PUBSUB: {
        id: '88',
        path: '/pubsub',
        parser: new SkywalkerParser(),
    },
    SEND_MESSAGE: {
        id: '132',
        path: '/ig_send_message',
    },
    SEND_MESSAGE_RESPONSE: {
        id: '133',
        path: '/ig_send_message_response',
        parser: new JsonParser(),
    },
    IRIS_SUB: {
        id: '134',
        path: '/ig_sub_iris',
    },
    IRIS_SUB_RESPONSE: {
        id: '135',
        path: '/ig_sub_iris_response',
        parser: new JsonParser(),
    },
    MESSAGE_SYNC: {
        id: '146',
        path: '/ig_message_sync',
        parser: new IrisParser(),
    },
    REALTIME_SUB: {
        id: '149',
        path: '/ig_realtime_sub',
        parser: new GraphqlParser(),
    },
    REGION_HINT: {
        id: '150',
        path: '/t_region_hint',
        parser: new RegionHintParser(),
    },
};

export const INSTAGRAM_PACKAGE_NAME = 'com.instagram.android';

export const FbnsTopics = {
    FBNS_MESSAGE: {
        id: '76',
        path: '/fbns_msg',
    },
    FBNS_REG_REQ: {
        id: '79',
        path: '/fbns_reg_req',
    },
    FBNS_REG_RESP: {
        id: '80',
        path: '/fbns_reg_resp',
    },
    FBNS_EXP_LOGGING: {
        id: '231',
        path: '/fbns_exp_logging',
    },
    PP: {
        id: '34',
        path: '/pp',
    },
};

export const FBNS = {
    PACKAGE: 'com.instagram.android',
    APP_ID: '567310203415052',
    HOST_NAME_V6: 'mqtts://mqtt-mini.facebook.com:443',
    CLIENT_CAPABILITIES: 439,
    ENDPOINT_CAPABILITIES: 128,
    CLIENT_STACK: 3,
    PUBLISH_FORMAT: 1,
};

export const REALTIME = {
    HOST_NAME_V6: 'mqtts://edge-mqtt.facebook.com:443',
};

// TODO: exclude in release
/* eslint @typescript-eslint/no-unused-vars: "off" */
export const PossibleTopics = [
    { id: '0', path: '/buddy_list' },
    { id: '1', path: '/create_thread' },
    { id: '2', path: '/create_thread_response' },
    { id: '3', path: '/delete_thread_notification' },
    { id: '4', path: '/delete_messages_notification' },
    { id: '5', path: '/orca_message_notifications' },
    { id: '6', path: '/friending_state_change' },
    { id: '7', path: '/friend_request' },
    { id: '8', path: '/friend_requests_seen' },
    { id: '9', path: '/graphql' },
    { id: '10', path: '/group_msg' },
    { id: '11', path: '/group_notifs_unseen' },
    { id: '12', path: '/group_msgs_unseen' },
    { id: '13', path: '/inbox' },
    { id: '14', path: '/action_id_notification' },
    { id: '15', path: '/aura_notification' },
    { id: '16', path: '/aura_signal' },
    { id: '17', path: '/friends_locations' },
    { id: '18', path: '/mark_thread' },
    { id: '19', path: '/mark_thread_response' },
    { id: '20', path: '/mercury' },
    { id: '21', path: '/messenger_sync' },
    { id: '22', path: '/messenger_sync_ack' },
    { id: '23', path: '/messenger_sync_create_queue' },
    { id: '24', path: '/messenger_sync_get_diffs' },
    { id: '25', path: '/messaging' },
    { id: '26', path: '/messaging_events' },
    { id: '27', path: '/mobile_requests_count' },
    { id: '28', path: '/mobile_video_encode' },
    { id: '29', path: '/orca_notification_updates' },
    { id: '30', path: '/notifications_sync' },
    { id: '31', path: '/notifications_read' },
    { id: '32', path: '/notifications_seen' },
    { id: '33', path: '/push_notification' },
    { id: '34', path: '/pp' },
    { id: '35', path: '/orca_presence' },
    { id: '36', path: '/privacy_changed' },
    { id: '37', path: '/privacy_updates' },
    { id: '38', path: '/send_additional_contacts' },
    { id: '39', path: '/send_chat_event' },
    { id: '40', path: '/send_delivery_receipt' },
    { id: '41', path: '/send_endpoint_capabilities' },
    { id: '42', path: '/foreground_state' },
    { id: '43', path: '/aura_location' },
    { id: '44', path: '/send_location' },
    { id: '45', path: '/send_message2' },
    { id: '46', path: '/send_message' },
    { id: '47', path: '/send_message_response' },
    { id: '48', path: '/ping' },
    { id: '49', path: '/presence' },
    { id: '50', path: '/send_push_notification_ack' },
    { id: '51', path: '/rich_presence' },
    { id: '52', path: '/send_skype' },
    { id: '53', path: '/typing' },
    { id: '54', path: '/set_client_settings' },
    { id: '55', path: '/shoerack_notifications' },
    { id: '56', path: '/orca_ticker_updates' },
    { id: '57', path: '/orca_typing_notifications' },
    { id: '58', path: '/typ' },
    { id: '59', path: '/t_ms' },
    { id: '60', path: '/orca_video_notifications' },
    { id: '61', path: '/orca_visibility_updates' },
    { id: '62', path: '/webrtc' },
    { id: '63', path: '/webrtc_response' },
    { id: '64', path: '/subscribe' },
    { id: '65', path: '/t_p' },
    { id: '66', path: '/push_ack' },
    { id: '68', path: '/webrtc_binary' },
    { id: '69', path: '/t_sm' },
    { id: '70', path: '/t_sm_rp' },
    { id: '71', path: '/t_vs' },
    { id: '72', path: '/t_rtc' },
    { id: '73', path: '/echo' },
    { id: '74', path: '/pages_messaging' },
    { id: '75', path: '/t_omnistore_sync' },
    { id: '76', path: '/fbns_msg' },
    { id: '77', path: '/t_ps' },
    { id: '78', path: '/t_dr_batch' },
    { id: '79', path: '/fbns_reg_req' },
    { id: '80', path: '/fbns_reg_resp' },
    { id: '81', path: '/omnistore_subscribe_collection' },
    { id: '82', path: '/fbns_unreg_req' },
    { id: '83', path: '/fbns_unreg_resp' },
    { id: '84', path: '/omnistore_change_record' },
    { id: '85', path: '/t_dr_response' },
    { id: '86', path: '/quick_promotion_refresh' },
    { id: '87', path: '/v_ios' },
    { id: '88', path: '/pubsub' },
    { id: '89', path: '/get_media' },
    { id: '90', path: '/get_media_resp' },
    { id: '91', path: '/mqtt_health_stats' },
    { id: '92', path: '/t_sp' },
    { id: '93', path: '/groups_landing_updates' },
    { id: '94', path: '/rs' },
    { id: '95', path: '/t_sm_b' },
    { id: '96', path: '/t_sm_b_rsp' },
    { id: '97', path: '/t_ms_gd' },
    { id: '98', path: '/t_rtc_multi' },
    { id: '99', path: '/friend_accepted' },
    { id: '100', path: '/t_tn' },
    { id: '101', path: '/t_mf_as' },
    { id: '102', path: '/t_fs' },
    { id: '103', path: '/t_tp' },
    { id: '104', path: '/t_stp' },
    { id: '105', path: '/t_st' },
    { id: '106', path: '/omni' },
    { id: '107', path: '/t_push' },
    { id: '108', path: '/omni_c' },
    { id: '109', path: '/t_sac' },
    { id: '110', path: '/omnistore_resnapshot' },
    { id: '111', path: '/t_spc' },
    { id: '112', path: '/t_callability_req' },
    { id: '113', path: '/t_callability_resp' },
    { id: '116', path: '/t_ec' },
    { id: '117', path: '/t_tcp' },
    { id: '118', path: '/t_tcpr' },
    { id: '119', path: '/t_ts' },
    { id: '120', path: '/t_ts_rp' },
    { id: '121', path: '/t_mt_req' },
    { id: '122', path: '/t_mt_resp' },
    { id: '123', path: '/t_inbox' },
    { id: '124', path: '/p_a_req' },
    { id: '125', path: '/p_a_resp' },
    { id: '126', path: '/unsubscribe' },
    { id: '127', path: '/t_graphql_req' },
    { id: '128', path: '/t_graphql_resp' },
    { id: '129', path: '/t_app_update' },
    { id: '130', path: '/p_updated' },
    { id: '131', path: '/t_omnistore_sync_low_pri' },
    { id: '132', path: '/ig_send_message' },
    { id: '133', path: '/ig_send_message_response' },
    { id: '134', path: '/ig_sub_iris' },
    { id: '135', path: '/ig_sub_iris_response' },
    { id: '136', path: '/ig_snapshot_response' },
    { id: '137', path: '/fbns_msg_hp' },
    { id: '138', path: '/data_stream' },
    { id: '139', path: '/opened_thread' },
    { id: '140', path: '/t_typ_att' },
    { id: '141', path: '/iris_server_reset' },
    { id: '142', path: '/flash_thread_presence' },
    { id: '143', path: '/flash_send_thread_presence' },
    { id: '144', path: '/flash_thread_typing' },
    { id: '146', path: '/ig_message_sync' },
    { id: '148', path: '/t_omnistore_batched_message' },
    { id: '149', path: '/ig_realtime_sub' },
    { id: '150', path: '/t_region_hint' },
    { id: '151', path: '/t_fb_family_navigation_badge' },
    { id: '152', path: '/t_ig_family_navigation_badge' },
    { id: '153', path: '/parties_notifications' },
    { id: '154', path: '/t_assist' },
    { id: '155', path: '/t_assist_rp' },
    { id: '156', path: '/t_create_group' },
    { id: '157', path: '/t_create_group_rp' },
    { id: '158', path: '/t_create_group_ms' },
    { id: '159', path: '/t_create_group_ms_rp' },
    { id: '160', path: '/t_entity_presence' },
    { id: '161', path: '/ig_region_hint_rp' },
    { id: '162', path: '/buddylist_overlay' },
    { id: '163', path: '/setup_debug' },
    { id: '164', path: '/ig_conn_update' },
    { id: '165', path: '/ig_msg_dr' },
    { id: '166', path: '/parties_notifications_req' },
    { id: '167', path: '/omni_connect_sync' },
    { id: '168', path: '/parties_send_message' },
    { id: '169', path: '/parties_send_message_response' },
    { id: '170', path: '/omni_connect_sync_req' },
    { id: '172', path: '/br_sr' },
    { id: '174', path: '/sr_res' },
    { id: '175', path: '/omni_connect_sync_batch' },
    { id: '176', path: '/notify_disconnect' },
    { id: '177', path: '/omni_mc_ep_push_req' },
    { id: '180', path: '/fbns_msg_ack' },
    { id: '181', path: '/t_add_participants_to_group' },
    { id: '182', path: '/t_add_participants_to_group_rp' },
    { id: '188', path: '/t_aloha_session_req' },
    { id: '195', path: '/t_thread_typing' },
    { id: '201', path: '/video_rt_pipe' },
    { id: '202', path: '/t_update_presence_extra_data' },
    { id: '203', path: '/video_rt_pipe_res' },
    { id: '211', path: '/onevc' },
    { id: '231', path: '/fbns_exp_logging' },
];