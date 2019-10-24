from __future__ import unicode_literals

from frappe import _


def get_data():
    return {
        'heatmap': True,
        'heatmap_message': _('This is based on transactions against this Save Box. See timeline below for details'),
        'fieldname': 'save_box',
        'transactions': [
                         {
                         'label': _('Save Transactions'),
                         'items': ['Save Advance', 'Save Cash']
                         }
                         ]
}
